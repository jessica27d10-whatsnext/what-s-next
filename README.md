# 🚀 What's Next  
### GenAI-Augmented Career Path Recommendation with Skill Gap Analysis & Job Market Forecasting

**What's Next** is an AI-powered career intelligence platform that analyzes user resumes or profile data to recommend suitable career paths, identify skill gaps, generate structured career roadmaps, and provide future job market insights.

The system is designed as a **decision-support platform**, combining Generative AI reasoning with deterministic scoring to ensure realistic and explainable outcomes.

---

## ✨ Features

- 📄 Resume upload (PDF) and intelligent profile extraction  
- 🧠 AI-driven career recommendations with match scores  
- 📊 Skill gap analysis with visual comparison  
- 🗺️ Multi-phase career roadmap generation (6–18 months)  
- 📈 Job market forecasting (demand, salary trend, emerging skills)  
- 🤖 Context-aware AI chatbot  
- 📥 Downloadable career intelligence report (PDF)

---

## 🧠 AI Architecture

User Input / Resume
↓
Text Extraction & Cleaning
↓
Stage 1: Profile Extraction (LLM)
↓
Structured Profile (JSON)
↓
Stage 2: Career Intelligence Engine (LLM)
↓
Skill Gap + Roadmap + Forecast
↓
Scoring & Validation Layer
↓
Frontend Visualization


This **multi-stage prompt pipeline** improves accuracy, consistency, and reduces hallucinations.

---

## 🛠 Tech Stack

### Frontend
- Next.js (React)
- Tailwind CSS
- Chart libraries for visualization

### Backend
- Next.js API Routes (Node.js)
- Resume parsing & validation logic

### AI / LLM
- Groq API
- LLaMA 3.1 (70B)
- Low-temperature deterministic prompting

### Deployment
- Vercel (Frontend + Backend)

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
