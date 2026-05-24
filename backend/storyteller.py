import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class AIStoryteller:
    def __init__(self):
        # We look specifically for the GROQ_API_KEY
        self.api_key = "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"
        
        if not self.api_key:
            print("!!! ERROR: GROQ_API_KEY NOT FOUND IN .ENV !!!")
            self.client = None
        else:
            print("--- Groq AI Connected ---")
            # Groq is compatible with the OpenAI library
            self.client = OpenAI(
                api_key=self.api_key,
                base_url="https://api.groq.com/openai/v1"
            )

    def generate_report(self, analysis_data, ml_results):
        if not self.client:
            return "Error: Backend could not find your GROQ_API_KEY."

        # Building a clean prompt for Groq
        prompt = f"""
        You are a Senior Data Analyst. Based on these results, write a strategy report.
        
        1. DATA STATS: {analysis_data.get('column_stats')}
        2. ML ACCURACY: {ml_results.get('score')}
        3. KEY FEATURES: {ml_results.get('feature_importance')}
        
        Provide:
        - Executive Summary
        - 3 Business Recommendations
        - Potential Risks
        """

        try:
            # We use Groq's best model: llama-3.3-70b-versatile
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return f"AI Error: {str(e)}"