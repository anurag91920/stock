"""
Defines route handlers for stock data and prediction APIs.

These routes delegate the core logic to service modules:
- `stock_service.py` handles CSV fetching, table data, graphs, and news.
- `stock_predict.py` handles linear regression prediction based on historical stock prices.
"""

from flask import Blueprint, jsonify
from app.services.stock_predict import run_prediction
from app.services.stock_service import (
    fetch_csv_data,
    generate_graph_data,
    generate_news_data,
    generate_table_data
)

# Create a Flask Blueprint for stock-related routes
stock_routes = Blueprint('stock_routes', __name__)

# Route: GET /stock/<symbol>
# Returns stock table data, price graph data, and related news for a given symbol
@stock_routes.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    df = fetch_csv_data(symbol)
    if df is None:
        return jsonify({'error': 'Data not found'}), 404
    return jsonify({
        'table': generate_table_data(df),
        'graph': generate_graph_data(df),
        'news': generate_news_data(symbol)
    })

# Route: GET /stock/<symbol>/predict
# Returns predicted stock prices based on past 5 years of data
@stock_routes.route('/stock/<symbol>/predict', methods=['GET'])
def predict(symbol):
    df = fetch_csv_data(symbol)
    if df is None:
        return jsonify({'error': 'Data not found'}), 404
    return jsonify(run_prediction(df))