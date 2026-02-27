import os
import re
import json
from typing import Dict, Any, List
import google.generativeai as genai
from dotenv import load_dotenv
from config.categories import CATEGORIES
from services.hf_classifier import classify_text_chunks

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

LANGUAGE_NAMES = {
    'en': 'English', 'hi': 'Hindi', 'es': 'Spanish', 'fr': 'French',
    'de': 'German', 'zh': 'Chinese', 'ar': 'Arabic', 'ja': 'Japanese',
    'ko': 'Korean', 'pt': 'Portuguese', 'ru': 'Russian', 'it': 'Italian'
}


async def categorize_and_summarize(processed_data: List[Dict[str, Any]], language: str = 'en') -> Dict[str, Any]:
    """
    Multimodal pipeline:
    1. Prepare content parts (text, audio, video) for Gemini
    2. Gemini (1.5-flash) → identify categories and generate summaries
    """
    try:
        # Since we are moving to direct multimodal analysis with Gemini, 
        # we'll let Gemini handle both classification and summarization 
        # for maximum effectiveness with audio/video.
        
        print(f"Step 1: Preparing multimodal parts for Gemini from {len(processed_data)} items...")
        
        # ── Step 1: Gemini Multimodal Analysis ──────────────────────────
        result = await generate_multimodal_analysis(processed_data, language)
        
        return result
        
    except Exception as e:
        print(f"Error in multimodal pipeline: {str(e)}")
        # Fallback to simple categorization if possible (extracting text from parts)
        text_content = ""
        for item in processed_data:
            if item["type"] == "text":
                text_content += item["content"] + "\n\n"
        return fallback_categorization(text_content)


async def generate_multimodal_analysis(
    processed_data: List[Dict[str, Any]], 
    language: str
) -> Dict[str, Any]:
    """
    Use Gemini to analyze multimodal content and return structured JSON.
    """
    if not GEMINI_API_KEY:
        return {"categories": {}}
    
    try:
        # Use a version that supports JSON schema if possible, or stick to flash
        model = genai.GenerativeModel('gemini-1.5-flash')
        language_name = LANGUAGE_NAMES.get(language, 'English')
        
        # Build prompt parts
        prompt_parts = [
            f"You are a news analyzer. Analyze the provided content (which may include text, audio, or video) and classify it into relevant news categories (e.g., Politics, Technology, Business, Sports, Entertainment, Health, Science).",
            f"Provide summaries in {language_name}.",
            "Return ONLY valid JSON in this exact format:",
            """{
  "categories": {
    "CategoryName": {
      "summary": "brief summary of content in this category",
      "articles": ["key point 1", "key point 2"],
      "confidence": 0.95
    }
  }
}""",
            "Return ONLY valid JSON, no markdown formatting."
        ]
        
        # Add actual content
        for item in processed_data:
            if item["type"] == "text":
                prompt_parts.append(f"Text content:\n{item['content'][:10000]}")
            elif item["type"] in ["audio", "video"]:
                # Pass file data directly to Gemini
                prompt_parts.append({
                    "mime_type": item["mime_type"],
                    "data": item["content"]
                })
        
        response = model.generate_content(prompt_parts)
        response_text = response.text
        
        # Clean up markdown code blocks if present
        response_text = re.sub(r'```json\n?', '', response_text)
        response_text = re.sub(r'```\n?', '', response_text)
        response_text = response_text.strip()
        
        return json.loads(response_text)
        
    except Exception as e:
        print(f"Gemini multimodal analysis error: {str(e)}")
        raise


def fallback_categorization(text: str) -> Dict[str, Any]:
    """
    Fallback keyword-based categorization when both AI models fail.
    """
    result = {"categories": {}}
    text_lower = text.lower()
    
    for category, data in CATEGORIES.items():
        score = 0
        matched_sentences = []
        
        for keyword in data["keywords"]:
            pattern = r'\b' + re.escape(keyword) + r'\b'
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            score += len(matches)
        
        if score > 0:
            sentences = re.split(r'[.!?]+', text)
            for sentence in sentences:
                if len(sentence.strip()) > 20:
                    sentence_lower = sentence.lower()
                    if any(keyword in sentence_lower for keyword in data["keywords"]):
                        matched_sentences.append(sentence.strip())
                        if len(matched_sentences) >= 3:
                            break
            
            result["categories"][category] = {
                "summary": f"Found {score} mentions related to {category.lower()}",
                "articles": matched_sentences if matched_sentences else [f"Content related to {category}"],
                "confidence": min(score / 10, 1.0)
            }
    
    return result
