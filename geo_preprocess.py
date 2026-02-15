import pandas as pd

# Load the CSV file
path = "DATA_GEO_Train.csv"   # put your correct file path here
df = pd.read_csv(path)

print("First 5 rows:")
print(df.head())

# Convert utc_time to datetime format
df['utc_time'] = pd.to_datetime(df['utc_time'])

print(df.dtypes)

df = df.set_index('utc_time')
df = df.sort_index()

print("Index set to time:")
print(df.head())

df_15 = df.resample("15T").mean()
print(df_15.head(20))


df_15 = df_15.interpolate(method='time')
print(df_15.head(20))


from sklearn.preprocessing import StandardScaler

# ---------------------------
# 6. Normalization
# ---------------------------

scaler = StandardScaler()

scaled_values = scaler.fit_transform(df_15.values)

df_scaled = pd.DataFrame(
    scaled_values,
    index=df_15.index,
    columns=df_15.columns
)

print("\nAfter normalization:")
print(df_scaled.head())

import numpy as np

# ---------------------------
# 7. Sliding Window Creation
# ---------------------------

def create_sliding_windows(data, lookback=96, forecast_steps=96):
    """
    data: numpy array of shape (n_samples, n_features)
    returns X and y for LSTM
    """
    X = []
    y = []

    for i in range(len(data) - lookback - forecast_steps):
        X.append(data[i : i + lookback])
        y.append(data[i + lookback : i + lookback + forecast_steps])

    return np.array(X), np.array(y)

# Convert normalized dataframe to numpy
data_np = df_scaled.values

LOOKBACK = 96       # past 24 hours
FORECAST = 96       # next 24 hours

X, y = create_sliding_windows(data_np, LOOKBACK, FORECAST)

print("\nShapes:")
print("X shape:", X.shape)   # (num_samples, 96, 4)
print("y shape:", y.shape)   # (num_samples, 96, 4)
