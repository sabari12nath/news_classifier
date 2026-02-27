from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import time
import json
from sqlalchemy.orm import Session
from services.file_processor import process_file
from services.categorizer import categorize_and_summarize
from routes import auth, reviews
from models.database import get_db, Analysis, CategoryResult, ArticlePoint, User
from jose import JWTError, jwt

app = FastAPI(title="Astra 2.0 API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for development, adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])

async def get_optional_user(token: Optional[str] = None, db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        # Bearer token handling
        if token.startswith("Bearer "):
            token = token[7:]
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return db.query(User).filter(User.email == email).first()
    except JWTError:
        return None

@app.get("/")
async def root():
    return {"message": "Astra 2.0 API is running", "status": "ok", "version": "2.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_files(
    files: List[UploadFile] = File(...),
    language: str = Form("en"),
    token: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    user = await get_optional_user(token, db)
    
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        
        print(f"Processing {len(files)} files in language: {language}")
        
        processed_data = [] # List of strings (text) or dicts (multimedia)
        for file in files:
            try:
                content = await file.read()
                result = await process_file(content, file.content_type, file.filename)
                if result:
                    processed_data.append(result)
            except Exception as e:
                print(f"Error processing {file.filename}: {str(e)}")
                continue
        
        if not processed_data:
            raise HTTPException(status_code=400, detail="Failed to process any files")
        
        # Pass the list of processed data (text strings and multimedia dicts) to the categorizer
        categorized_data = await categorize_and_summarize(processed_data, language)
        
        total_articles = sum(
            len(cat_data.get("articles", []))
            for cat_data in categorized_data.get("categories", {}).values()
        )
        
        processing_time = round(time.time() - start_time, 2)
        
        # Persistence Logic
        db_analysis = Analysis(
            user_id=user.id if user else None,
            language=language,
            files_processed=len(files),
            total_articles=total_articles,
            processing_time=processing_time
        )
        db.add(db_analysis)
        db.flush() # Get id
        
        for cat_name, cat_data in categorized_data.get("categories", {}).items():
            db_cat = CategoryResult(
                analysis_id=db_analysis.id,
                category_name=cat_name,
                summary=cat_data.get("summary"),
                confidence=cat_data.get("confidence")
            )
            db.add(db_cat)
            db.flush()
            
            for article in cat_data.get("articles", []):
                db_point = ArticlePoint(
                    category_result_id=db_cat.id,
                    content=article
                )
                db.add(db_point)
        
        db.commit()
        
        response = {
            **categorized_data,
            "metadata": {
                "id": db_analysis.id,
                "filesProcessed": len(files),
                "totalArticles": total_articles,
                "processingTime": str(processing_time),
                "language": language,
                "saved": True
            }
        }
        
        return response
        
    except Exception as e:
        db.rollback()
        print(f"Error in analyze endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history(
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = await get_optional_user(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    analyses = db.query(Analysis).filter(Analysis.user_id == user.id).order_by(Analysis.created_at.desc()).all()
    
    result = []
    for analysis in analyses:
        analysis_data = {
            "id": analysis.id,
            "created_at": analysis.created_at,
            "language": analysis.language,
            "files_processed": analysis.files_processed,
            "total_articles": analysis.total_articles,
            "processing_time": analysis.processing_time,
            "categories": {}
        }
        for cat in analysis.categories:
            analysis_data["categories"][cat.category_name] = {
                "summary": cat.summary,
                "confidence": cat.confidence,
                "articles": [p.content for p in cat.articles]
            }
        result.append(analysis_data)
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
