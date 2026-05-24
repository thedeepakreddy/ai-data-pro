from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from janitor import DataJanitor # Our Part 2 logic

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (React, etc)
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (POST, GET, etc)
    allow_headers=["*"], # Allows all headers
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



from ml_engine import MLEngine # New Import

# Temporary storage to remember the data between clicks
state = {"df": None}

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    # ... (cleaning & analysis) ...
    state["df"] = clean_df # Remember the data!
    return { "analysis": analysis_results, "preview": ... }

@app.post("/train")
async def train_model(target_column: str):
    if state["df"] is None:
        raise HTTPException(status_code=400, detail="No data found")
    
    # Part 4: Run ML
    engine = MLEngine(state["df"], target_column)
    ml_results = engine.run()
    return ml_results




from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

# All our custom modules
from janitor import DataJanitor
from analyzer import DataAnalyzer
from ml_engine import MLEngine
from storyteller import AIStoryteller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
state = {"df": None}
report_storage = {"last_ml": None}

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1].lower()
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents)) if extension == "csv" else pd.read_excel(io.BytesIO(contents))
    except:
        raise HTTPException(status_code=400, detail="Invalid file")

    janitor = DataJanitor(df)
    clean_df = janitor.clean()
    state["df"] = clean_df # Save for ML
    
    analyzer = DataAnalyzer(clean_df)
    return {
        "summary": janitor.get_summary(),
        "analysis": analyzer.get_analysis(),
        "preview": clean_df.head(10).to_dict(orient="records")
    }

@app.post("/train")
async def train_model(target_column: str):
    if state["df"] is None:
        raise HTTPException(status_code=400, detail="Upload data first")
    
    engine = MLEngine(state["df"], target_column)
    results = engine.run()
    report_storage["last_ml"] = results # Save for Storyteller
    return results

@app.post("/report")
async def get_ai_report():
    if state["df"] is None or report_storage["last_ml"] is None:
        raise HTTPException(status_code=400, detail="Complete ML training first")

    analyzer = DataAnalyzer(state["df"])
    story = AIStoryteller()
    report = story.generate_report(analyzer.get_analysis(), report_storage["last_ml"])
    return {"report": report}
