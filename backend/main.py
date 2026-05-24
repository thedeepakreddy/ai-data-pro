from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from janitor import DataJanitor # Our Part 2 logic

app = FastAPI()

# Enable CORS so the React Frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Cleaning Logic
    janitor = DataJanitor(df)
    clean_df = janitor.clean()
    
    return {"message": "Data Cleaned", "preview": clean_df.head().to_dict()}

from analyzer import DataAnalyzer # New Import

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    # ... (same loading logic as above) ...
    
    janitor = DataJanitor(df)
    clean_df = janitor.clean()

    # Part 3: Analyze
    analyzer = DataAnalyzer(clean_df)
    analysis_results = analyzer.get_analysis()

    return {
        "summary": janitor.get_summary(),
        "analysis": analysis_results, # New analysis data for charts
        "preview": clean_df.head(10).to_dict(orient="records")
    }
