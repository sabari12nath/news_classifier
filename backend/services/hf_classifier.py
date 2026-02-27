import os
import threading
from typing import Dict, List, Optional
from transformers import pipeline

# Singleton classifier instance
_classifier = None
_lock = threading.Lock()

# News categories for zero-shot classification
CANDIDATE_LABELS = [
    "Politics",
    "Sports", 
    "Business",
    "Technology",
    "Entertainment",
    "Health",
    "Science",
    "World News"
]

def get_classifier():
    """
    Lazy-load the HuggingFace zero-shot classification pipeline (singleton).
    Uses facebook/bart-large-mnli — a state-of-the-art English zero-shot classifier.
    """
    global _classifier
    if _classifier is None:
        with _lock:
            if _classifier is None:
                print("Loading HuggingFace model: facebook/bart-large-mnli ...")
                _classifier = pipeline(
                    "zero-shot-classification",
                    model="facebook/bart-large-mnli",
                    device=-1  # CPU
                )
                print("HuggingFace model loaded successfully!")
    return _classifier


def classify_text(text: str, threshold: float = 0.15) -> Dict[str, float]:
    """
    Classify text into news categories using HuggingFace zero-shot classification.
    
    Args:
        text: The news text to classify
        threshold: Minimum confidence to include a category (0.0 - 1.0)
    
    Returns:
        Dict of {category: confidence_score} for categories above threshold
    """
    classifier = get_classifier()
    
    # Truncate text to ~1000 chars for speed (model context is limited)
    # Use the first chunk as it usually contains the most informative content
    truncated = text[:2000] if len(text) > 2000 else text
    
    try:
        result = classifier(
            truncated,
            candidate_labels=CANDIDATE_LABELS,
            multi_label=True  # Allow multiple categories
        )
        
        # Build category -> confidence mapping
        scores: Dict[str, float] = {}
        for label, score in zip(result["labels"], result["scores"]):
            if score >= threshold:
                scores[label] = round(score, 4)
        
        return scores
        
    except Exception as e:
        print(f"HuggingFace classification error: {e}")
        return {}


def classify_text_chunks(text: str, chunk_size: int = 2000, threshold: float = 0.15) -> Dict[str, float]:
    """
    Classify long text by splitting into chunks and averaging scores.
    
    For long articles, splits text into chunks, classifies each,
    then returns the maximum confidence per category across all chunks.
    """
    if len(text) <= chunk_size:
        return classify_text(text, threshold)
    
    # Split into chunks
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size]
        if len(chunk.strip()) > 50:  # Skip tiny fragments
            chunks.append(chunk)
    
    # Limit to first 3 chunks for speed
    chunks = chunks[:3]
    
    # Classify each chunk
    all_scores: Dict[str, List[float]] = {}
    for chunk in chunks:
        chunk_scores = classify_text(chunk, threshold=0.0)  # Get all scores
        for label, score in chunk_scores.items():
            if label not in all_scores:
                all_scores[label] = []
            all_scores[label].append(score)
    
    # Take max confidence per category
    final_scores: Dict[str, float] = {}
    for label, scores_list in all_scores.items():
        max_score = max(scores_list)
        if max_score >= threshold:
            final_scores[label] = round(max_score, 4)
    
    return final_scores
