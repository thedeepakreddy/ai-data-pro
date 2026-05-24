from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from janitor import DataJanitor
from analyzer import DataAnalyzer
from ml_engine import MLEngine
from storyteller import AIStoryteller

app = FastAPI()

# Allows your Vercel frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

state = {"df": None, "last_analysis": None}
report_storage = {"last_ml": None}

@app.get("/")
def home():
    return {"status": "Backend Active"}

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
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(target_column: str = Query(...)):
    if state["df"] is None: 
        raise HTTPException(status_code=400, detail="Upload data first.")
    try:
        engine = MLEngine(state["df"], target_column)
        results = engine.run()
        report_storage["last_ml"] = results
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report")
async def generate_ai_report():
    if report_storage["last_ml"] is None:
        raise HTTPException(status_code=400, detail="Run ML first.")
    try:
        storyteller = AIStoryteller()
        report = storyteller.generate_report(state["last_analysis"], report_storage["last_ml"])
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))