CATEGORIES = {
    "Politics": {
        "keywords": ["election", "government", "parliament", "minister", "policy", "vote", "political", 
                    "democracy", "legislation", "congress", "senate", "president", "prime minister"],
        "subcategories": ["Elections", "Government Policy", "International Relations", "Political Parties"]
    },
    "Sports": {
        "keywords": ["football", "cricket", "basketball", "tennis", "olympics", "championship", "tournament", 
                    "player", "team", "match", "score", "league", "athlete", "coach"],
        "subcategories": ["Football", "Cricket", "Basketball", "Tennis", "Olympics"]
    },
    "Business": {
        "keywords": ["economy", "market", "stock", "company", "finance", "investment", "trade", "business", 
                    "corporate", "revenue", "profit", "startup", "entrepreneur"],
        "subcategories": ["Markets", "Companies", "Economy", "Startups"]
    },
    "Technology": {
        "keywords": ["tech", "software", "ai", "artificial intelligence", "computer", "digital", "internet", 
                    "app", "innovation", "gadget", "smartphone", "cyber", "data"],
        "subcategories": ["AI & ML", "Software", "Hardware", "Cybersecurity"]
    },
    "Entertainment": {
        "keywords": ["movie", "film", "music", "celebrity", "entertainment", "actor", "actress", "concert", 
                    "album", "show", "series", "hollywood", "bollywood"],
        "subcategories": ["Movies", "Music", "Television", "Celebrities"]
    },
    "Health": {
        "keywords": ["health", "medical", "doctor", "hospital", "disease", "treatment", "medicine", "patient", 
                    "vaccine", "wellness", "fitness", "nutrition"],
        "subcategories": ["Medical Research", "Public Health", "Wellness", "Healthcare"]
    },
    "Science": {
        "keywords": ["science", "research", "study", "discovery", "scientist", "experiment", "space", "climate", 
                    "environment", "physics", "chemistry", "biology"],
        "subcategories": ["Space", "Environment", "Research", "Climate"]
    },
    "World News": {
        "keywords": ["international", "global", "world", "country", "nation", "foreign", "diplomatic", "conflict", 
                    "war", "peace", "united nations"],
        "subcategories": ["International Relations", "Conflicts", "Global Events"]
    }
}

def get_category_keywords():
    """Return all category keywords for matching"""
    return CATEGORIES
