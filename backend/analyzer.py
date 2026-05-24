import pandas as pd
import numpy as np

class DataAnalyzer:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def get_analysis(self):
        return {
            "correlations": self.get_correlations(),
            "column_stats": self.get_column_types(),
            "chart_data": self.get_chart_data(),
            "descriptive_stats": self.get_descriptive_stats()
        }

    def get_descriptive_stats(self):
        numeric_df = self.df.select_dtypes(include=[np.number])
        stats = {}
        for col in numeric_df.columns:
            q1 = numeric_df[col].quantile(0.25)
            q3 = numeric_df[col].quantile(0.75)
            iqr = q3 - q1
            outliers = ((numeric_df[col] < (q1 - 1.5 * iqr)) | (numeric_df[col] > (q3 + 1.5 * iqr))).sum()
            stats[col] = {
                "mean": round(float(numeric_df[col].mean()), 2),
                "median": round(float(numeric_df[col].median()), 2),
                "std": round(float(numeric_df[col].std()), 2),
                "outliers": int(outliers)
            }
        return stats

    def get_correlations(self):
        numeric_df = self.df.select_dtypes(include=[np.number])
        return numeric_df.corr().round(2).to_dict() if not numeric_df.empty else {}

    def get_column_types(self):
        return [{"name": c, "type": str(self.df[c].dtype), "unique_values": int(self.df[c].nunique())} for c in self.df.columns]

    def get_chart_data(self):
        charts = {}
        # Get categorical columns
        for col in self.df.select_dtypes(include=['object', 'category']).columns:
            charts[col] = self.df[col].value_counts().head(10).to_dict()
        return charts