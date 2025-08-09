

import yfinance as yf
import os

# Make sure the data folder exists
os.makedirs("backend/data", exist_ok=True)

tickers = ['TCS.NS', 'INFY.NS', 'RELIANCE.NS']

for ticker in tickers:
    print(f"Downloading {ticker}...")
    data = yf.download(ticker, period='5y', interval='1d')
    csv_path = f'backend/data/{ticker}.csv'
    data.to_csv(csv_path)
    print(f"Saved: {csv_path}")