# News Categorizer AI

A full-stack multimedia news categorization system that uses AI to analyze and categorize news content from PDFs, videos, audio files, and text documents.

## 🚀 Features

- **Multimedia Support**: Upload PDF newspapers, videos, audio files, and text documents
- **AI-Powered Categorization**: Uses Google Gemini AI to intelligently categorize news into 8 categories:
  - Politics
  - Sports
  - Business
  - Technology
  - Entertainment
  - Health
  - Science
  - World News
- **Multilingual Support**: Output summaries in 12+ languages
- **Smart Summarization**: Generates concise summaries for each category
- **Fallback System**: Keyword-based categorization when AI is unavailable
- **Modern UI**: Beautiful glassmorphism design with dark mode

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Dropzone
- Lucide React Icons

**Backend:**
- Python 3.10+
- FastAPI
- PyPDF2 (PDF processing)
- Google Gemini AI
- Uvicorn (ASGI server)

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Google Gemini API key (free tier available at [https://ai.google.dev](https://ai.google.dev))

## ⚙️ Installation

### 1. Clone the repository

```bash
cd "c:\Desktop\mini project"
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here
```

## 🚀 Running the Application

### Start the Backend (Terminal 1)

```bash
cd backend
venv\Scripts\activate  # On Windows
python -m uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Start the Frontend (Terminal 2)

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage

1. Open `http://localhost:3000` in your browser
2. Select your preferred output language
3. Drag and drop or click to upload files:
   - PDF newspapers
   - Text documents
   - Video files (transcription placeholder)
   - Audio files (transcription placeholder)
4. Wait for processing (typically 5-15 seconds)
5. View categorized news with summaries

## 🔑 Getting a Gemini API Key

1. Visit [https://ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Sign in with your Google account
4. Create a new API key
5. Copy the key and add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 📁 Project Structure

```
mini project/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── FileUploader.tsx   # File upload component
│   ├── CategoryCard.tsx   # Category display
│   └── LanguageSelector.tsx
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── services/         # Business logic
│   │   ├── file_processor.py
│   │   └── categorizer.py
│   ├── config/           # Configuration
│   │   └── categories.py
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
├── package.json          # Node.js dependencies
├── next.config.mjs       # Next.js configuration
└── tailwind.config.ts    # Tailwind configuration
```

## 🎯 API Endpoints

### `POST /api/analyze`

Analyze and categorize uploaded files.

**Request:**
- `files`: List of files (multipart/form-data)
- `language`: Language code (en, hi, es, fr, etc.)

**Response:**
```json
{
  "categories": {
    "Politics": {
      "summary": "Summary of political news",
      "articles": ["Article 1", "Article 2"],
      "confidence": 0.95
    }
  },
  "metadata": {
    "filesProcessed": 1,
    "totalArticles": 5,
    "processingTime": "3.45",
    "language": "en"
  }
}
```

## 🐛 Troubleshooting

**Backend not starting:**
- Make sure Python 3.10+ is installed
- Activate the virtual environment
- Check if port 8000 is available

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`

**PDF processing fails:**
- Ensure PyPDF2 is installed: `pip install PyPDF2`
- Some PDFs may be scanned images (OCR not implemented)

**AI categorization not working:**
- Check if GEMINI_API_KEY is set in `backend/.env`
- Verify API key is valid
- System will fallback to keyword-based categorization

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.
