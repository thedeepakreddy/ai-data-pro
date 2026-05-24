import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import accuracy_score, r2_score
from sklearn.preprocessing import LabelEncoder

class MLEngine:
    def __init__(self, df: pd.DataFrame, target_column: str):
        self.df = df.copy()
        self.target = target_column
        self.model = None
        self.task_type = None 

    def run(self):
        # 1. Drop rows where target is missing
        self.df = self.df.dropna(subset=[self.target])

        # 2. Handle Date columns
        for col in self.df.select_dtypes(include=['datetime64']).columns:
            self.df[f"{col}_year"] = self.df[col].dt.year
            self.df[f"{col}_month"] = self.df[col].dt.month
            self.df.drop(columns=[col], inplace=True)

        # 3. Features and Target
        X = self.df.drop(columns=[self.target])
        y = self.df[self.target]

        # 4. Encode Text
        le = LabelEncoder()
        for col in X.select_dtypes(include=['object']).columns:
            X[col] = le.fit_transform(X[col].astype(str))

        # 5. Detect Task
        if y.dtype == 'object' or y.nunique() < 15:
            self.task_type = "classification"
            y = le.fit_transform(y.astype(str))
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        else:
            self.task_type = "regression"
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)

        # 6. Train
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)

        # 7. Evaluate
        predictions = self.model.predict(X_test)
        score = accuracy_score(y_test, predictions) if self.task_type == "classification" else r2_score(y_test, predictions)

        # 8. Importance
        importance = dict(zip(X.columns, self.model.feature_importances_.tolist()))
        
        return {
            "task": self.task_type,
            "score": round(score, 4),
            "metric": "Accuracy" if self.task_type == "classification" else "R2 Score",
            "feature_importance": dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        }