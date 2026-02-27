# 🚀 Astra 2.0 - Quick Start Guide

## What is Astra 2.0?

**Astra 2.0** is an advanced AI-powered news analysis platform that intelligently categorizes multimedia content!

### ✨ Features:
- 📰 Upload PDF newspapers and text files
- 🤖 AI categorization into 8 news categories
- 🌍 Multilingual summaries (12 languages)
- 📊 Real-time processing with beautiful UI
- 🎨 Professional glassmorphism design
- 🔐 Dummy authentication for demos

---

## 🏃 How to Run

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
npm run dev
```

---

## 🎯 How to Use

1. Open `http://localhost:3000`
2. Click **"Get Started"** or **"Sign In"**
3. Enter **any email/password** (demo mode)
4. Select your output language
5. Drag & drop or click to upload files
6. Wait for AI analysis
7. View categorized news with summaries!

---

## 🔑 Optional: Add Gemini API Key

For better AI categorization:
1. Get free key: https://ai.google.dev
2. Edit `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Restart backend

**Works without API key** using keyword-based categorization!

---

## 📁 Supported Files

- ✅ PDF Documents (.pdf)
- ✅ Text Files (.txt)
- 🔄 Video/Audio (placeholder - requires additional setup)

---

## 🎨 What Makes Astra 2.0 Unique?

- **Professional UI** - Modern glassmorphism design
- **Dummy Auth** - Perfect for demos and prototypes
- **AI-Powered** - Google Gemini integration
- **Multilingual** - 12+ language support
- **Fast** - Real-time analysis and categorization

---

Enjoy Astra 2.0! 🎉
