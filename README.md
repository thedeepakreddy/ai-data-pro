# 🚀 InsightPro: Industrial Intelligence Engine

**InsightPro** is a professional-grade data science platform designed to transform raw, messy datasets into high-impact executive strategies. Featuring a sharp, industrial "geometric" interface, an autonomous Machine Learning engine, and Llama-3.3 AI integration, it provides a complete end-to-end solution for modern business intelligence.

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

---

## ✨ Key Features

- **🔳 Flat Geometric UI:** A high-contrast, professional "90-degree" industrial interface built for enterprise-level data visualization.
- **📊 Descriptive Analysis Matrix:** Automated computation of **Mean, Median, Standard Deviation**, and **Critical Outlier Detection**.
- **🤖 Autonomous ML Engine:** Intelligent feature encoding and model selection providing a real-time **Confidence Index (%)**.
- **🧠 AI Strategy Storyteller:** Leverages **Llama-3.3-70B** to generate structured executive reports including Business Recommendations and Risk Mitigation.

---

## 🚀 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/thedeepakreddy/ai-data-pro.git
cd ai-data-pro
```
### 2. Backend Installation
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the industrial dashboard.

---

## 🌐 Production Deployment

### **Backend (Render.com)**
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable:** Set `GROQ_API_KEY` for the AI Storyteller.

### **Frontend (Vercel.com)**
- **Framework Preset:** `Next.js`
- **Root Directory:** `frontend`
- **Environment Variable:** Set `NEXT_PUBLIC_API_URL` to your live Render URL.

---

## 📂 Project Structure
```text
ai-data-pro/
├── backend/            
│   ├── main.py         # FastAPI production server
│   ├── analyzer.py     # Statistical & Descriptive engine
│   ├── ml_engine.py    # Predictive modeling logic
│   ├── janitor.py      # Data cleaning logic
│   └── storyteller.py  # AI strategy generation
├── frontend/           
│   ├── app/
│   │   ├── page.js     // Professional Dashboard UI
│   │   └── globals.css // Global enterprise styles
│   └── package.json    // JS Dependencies
└── README.md
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

**Developed with 🦾 by [Deepak Reddy](https://github.com/thedeepakreddy)**
```
