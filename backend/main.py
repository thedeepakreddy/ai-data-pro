from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import pandas as pd
import io
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from janitor import DataJanitor
from analyzer import DataAnalyzer
from ml_engine import MLEngine
from storyteller import AIStoryteller

# --- STARTUP LOGIC ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Check if the environment variable is set
    key = os.getenv("GROQ_API_KEY")
    if key:
        print("\n" + "⭐" * 40)
        print("  ✅ SUCCESS: Groq API Key Found!")
        print("  Backend is ready for AI Storytelling.")
        print("⭐" * 40 + "\n")
    else:
        print("\n" + "❌" * 40)
        print("  ERROR: Groq API Key NOT FOUND!")
        print("  Make sure your .env file has: GROQ_API_KEY=your_key")
        print("❌" * 40 + "\n")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Storage
state = {"df": None, "last_analysis": None}
report_storage = {"last_ml": None}

@app.get("/")
def home():
    return {"status": "Backend Running", "api_key_loaded": os.getenv("GROQ_API_KEY") is not None}

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents)) if file.filename.endswith('.csv') else pd.read_excel(io.BytesIO(contents))
        
        janitor = DataJanitor(df)
        clean_df = janitor.clean()
        state["df"] = clean_df 
        
        analyzer = DataAnalyzer(clean_df)
        state["last_analysis"] = analyzer.get_analysis()
        
        return {
            "analysis": state["last_analysis"], 
            "preview": clean_df.head(10).to_dict(orient="records"), 
            "summary": janitor.get_summary()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/train")
async def train_model(target_column: str = Query(...)):
    if state["df"] is None: 
        raise HTTPException(status_code=400, detail="No data found. Upload a file first.")
    
    try:
        engine = MLEngine(state["df"], target_column)
        results = engine.run()
        report_storage["last_ml"] = results
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/report")
async def generate_ai_report():
    if report_storage["last_ml"] is None:
        raise HTTPException(status_code=400, detail="Machine Learning results not found. Run AutoML first.")
    
    try:
        storyteller = AIStoryteller()
        report = storyteller.generate_report(state["last_analysis"], report_storage["last_ml"])
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Report failed: {str(e)}")

# This allows you to run the app using 'python3 main.py'
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)