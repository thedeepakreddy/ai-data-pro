import pandas as pd
import numpy as np

class DataAnalyzer:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def get_analysis(self):
        """Main function to generate all EDA data"""
        return {
            "correlations": self.get_correlations(),
            "column_stats": self.get_column_types(),
            "geo_data": self.get_geo_details(),
            "chart_data": self.get_chart_data(),
            "descriptive_stats": self.get_descriptive_stats(),
            "health_score": self.get_health_score()
        }

    def get_health_score(self):
        """Calculates percentage of non-null data"""
        total_cells = self.df.size
        if total_cells == 0: return 0
        null_cells = self.df.isnull().sum().sum()
        score = ((total_cells - null_cells) / total_cells) * 100
        return round(score, 1)

    def get_descriptive_stats(self):
        """Calculates mean, median, std, and outliers for numeric columns"""
        numeric_df = self.df.select_dtypes(include=[np.number])
        stats = {}
        
        for col in numeric_df.columns:
            q1 = numeric_df[col].quantile(0.25)
            q3 = numeric_df[col].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            outliers = ((numeric_df[col] < lower_bound) | (numeric_df[col] > upper_bound)).sum()
            
            stats[col] = {
                "mean": round(float(numeric_df[col].mean()), 2),
                "median": round(float(numeric_df[col].median()), 2),
                "std": round(float(numeric_df[col].std()), 2),
                "min": round(float(numeric_df[col].min()), 2),
                "max": round(float(numeric_df[col].max()), 2),
                "outliers": int(outliers)
            }
        return stats

    def get_correlations(self):
        numeric_df = self.df.select_dtypes(include=[np.number])
        if numeric_df.empty: return {}
        return numeric_df.corr().round(2).to_dict()

    def get_column_types(self):
        stats = []
        for col in self.df.columns:
            stats.append({
                "name": col,
                "type": str(self.df[col].dtype),
                "unique_values": int(self.df[col].nunique())
            })
        return stats

    def get_geo_details(self):
        cols = [c.lower() for c in self.df.columns]
        if any(x in cols for x in ['lat', 'latitude']) and any(x in cols for x in ['lon', 'longitude', 'lng']):
            lat_col = [c for c in self.df.columns if c.lower() in ['lat', 'latitude']][0]
            lon_col = [c for c in self.df.columns if c.lower() in ['lon', 'longitude', 'lng']][0]
            return self.df.dropna(subset=[lat_col, lon_col]).head(100).to_dict(orient='records')
        return None

    def get_chart_data(self):
        charts = {}
        cat_cols = self.df.select_dtypes(include=['object', 'category']).columns
        for col in cat_cols:
            charts[col] = self.df[col].value_counts().head(10).to_dict()
        return charts