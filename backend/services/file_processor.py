import PyPDF2
import io

async def process_file(content: bytes, content_type: str, filename: str) -> dict:
    """
    Process uploaded file and extract content or return metadata for multimodal analysis
    Returns a dict with 'type' (text/audio/video) and 'content' (str/bytes)
    """
    try:
        content_type_lower = content_type.lower()
        if 'pdf' in content_type_lower or filename.endswith('.pdf'):
            text = await process_pdf(content)
            return {"type": "text", "content": text}
        elif 'text' in content_type_lower or filename.endswith('.txt'):
            text = process_text(content)
            return {"type": "text", "content": text}
        elif 'video' in content_type_lower:
            return {"type": "video", "content": content, "mime_type": content_type}
        elif 'audio' in content_type_lower:
            return {"type": "audio", "content": content, "mime_type": content_type}
        else:
            return {"type": "text", "content": f"Unsupported file type: {content_type}"}
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise

async def process_pdf(content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise Exception("Failed to extract text from PDF")

def process_text(content: bytes) -> str:
    """Process text file"""
    try:
        return content.decode('utf-8')
    except UnicodeDecodeError:
        # Try different encodings
        try:
            return content.decode('latin-1')
        except:
            raise Exception("Failed to decode text file")
