import os
from openai import OpenAI

class AIStoryteller:
    def __init__(self):
        # API KEY HARDCODED AS REQUESTED
        self.api_key = "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"
        
        if not self.api_key:
            self.client = None
        else:
            # Groq is compatible with the OpenAI library
            self.client = OpenAI(
                api_key=self.api_key,
                base_url="https://api.groq.com/openai/v1"
            )

    def generate_report(self, analysis_data, ml_results):
        if not self.client:
            return "Error: Backend could not find your Groq API Key."

        prompt = f"""
        You are a Senior Data Analyst. Based on these results, write a strategy report.
        Use large headings (starting with #) for sections.
        
        1. DATA STATS: {analysis_data.get('column_stats')}
        2. ML ACCURACY: {ml_results.get('score')}
        3. KEY FEATURES: {ml_results.get('feature_importance')}
        
        Provide:
        - # Executive Summary
        - ## 3 Business Recommendations
        - ## Potential Risks
        """

        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"AI Error: {str(e)}"