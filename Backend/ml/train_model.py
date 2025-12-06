import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, '../data/startup_data.csv')
model_path = os.path.join(current_dir, 'models/startup_predictor.pkl')

try:
    df = pd.read_csv(data_path)
    print(f"Data loaded: {len(df)} rows")
except FileNotFoundError:
    print("Error: Dataset not found at", data_path)
    exit()

le_sector = LabelEncoder()
le_market = LabelEncoder()
le_comp = LabelEncoder()

df['Sector'] = le_sector.fit_transform(df['Sector'])
df['MarketSize'] = le_market.fit_transform(df['MarketSize'])
df['Competition'] = le_comp.fit_transform(df['Competition'])

X = df[['Funding', 'TeamSize', 'Sector', 'MarketSize', 'Competition']]
y = df['Outcome']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

artifacts = {
    'model': model,
    'le_sector': le_sector,
    'le_market': le_market,
    'le_comp': le_comp
}

os.makedirs(os.path.dirname(model_path), exist_ok=True)
joblib.dump(artifacts, model_path)
print(f"Model saved to: {model_path}")