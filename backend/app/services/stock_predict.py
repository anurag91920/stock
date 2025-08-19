"""
Service module to handle stock price predictions.

Uses yfinance to fetch historical stock data and applies a linear regression model
to forecast closing prices for the next 10 years.
"""


import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from flask import jsonify
import pandas as pd
import os

DATA_FOLDER = 'data'

def predict_stock_handler(request):
    """
    Handles prediction request based on historical stock data.

    Args:
        request: Flask request containing 'ticker' as a query parameter.

    Returns:
        JSON response with:
            - predicted closing prices for the next 10 years
            - actual historical closing prices
            - return projections for stock purchases
    """
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    try:
        # Load CSV data from local file
        file_path = os.path.join(DATA_FOLDER, f"{ticker}.csv")
        if not os.path.exists(file_path):
            return jsonify({'error': f'CSV data not found for the ticker symbol: {ticker}'}), 404

        # Skip the first 3 rows which contain metadata and set proper column names
        data = pd.read_csv(file_path, skiprows=3, header=None)
        if data.empty or len(data.columns) < 6:
            return jsonify({'error': 'Invalid or empty CSV file - insufficient columns'}), 400
        
        # Set proper column names based on the CSV structure
        data.columns = ['Date', 'Close', 'High', 'Low', 'Open', 'Volume']

        # Convert 'Date' to datetime
        data['Date'] = pd.to_datetime(data['Date'])
        data = data.sort_values('Date')

        data.set_index('Date', inplace=True)
        X = data.index.map(datetime.toordinal).values.reshape(-1, 1)
        y = data['Close'].values.flatten()
        actual_dates = data.index.strftime('%Y-%m-%d').tolist()

        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)

        # Generate future dates (1 to 10 years ahead)
        future_dates = [datetime.now() + timedelta(days=365 * i) for i in range(1, 11)]
        future_dates_ordinal = [date.toordinal() for date in future_dates]
        predictions = model.predict(np.array(future_dates_ordinal).reshape(-1, 1))
        predicted_dates = [date.strftime('%Y-%m-%d') for date in future_dates]

        # Project return values for selected stock quantities
        stocks = [10, 20, 50, 100]
        current_price = y[-1]
        returns = [
            {
                'stocks_bought': stock,
                'current_price': round(current_price * stock, 2),
                'after_1_year': round(predictions[0] * stock, 0),
                'after_5_years': round(predictions[4] * stock, 0),
                'after_10_years': round(predictions[9] * stock, 0)
            }
            for stock in stocks
        ]

        # Return predictions, actual data, and return projection
        return jsonify({
            'predictions': predictions.tolist(),
            'predicted_dates': predicted_dates,
            'actual': y.tolist(),
            'actual_dates': [str(date) for date in data.index.date],
            'returns': returns
        })

    except Exception as e:
        return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500