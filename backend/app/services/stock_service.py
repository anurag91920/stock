"""
Service module to fetch and process stock data using yfinance and Plotly.

Provides functionality for:
- Retrieving stock price history
- Generating chart and table data
- Returning the results as a JSON response
"""

import yfinance as yf
import pandas as pd
import json
import plotly.express as px
import plotly
from flask import jsonify

def get_stock_data_handler(request):
    """
    Handles GET request for stock data. Returns price chart, table, and periods in JSON format.
    """
    stock = request.args.get('ticker')
    chart_period = request.args.get('chart_period', '1mo')
    table_period = request.args.get('table_period', '1mo')

    if not stock:
        return jsonify({"error": "Ticker parameter is required"}), 400

    try:
        # Fetch historical data for chart and table separately
        chart_data = yf.Ticker(stock).history(period=chart_period).reset_index()
        table_data = yf.Ticker(stock).history(period=table_period).reset_index()

        # Format date columns
        chart_data['Date'] = pd.to_datetime(chart_data['Date']).dt.strftime('%d-%m-%Y')
        table_data['Date'] = pd.to_datetime(table_data['Date']).dt.strftime('%d-%m-%Y')

        # Generate line chart
        fig1 = px.line(chart_data, x='Date', y='Close', title=f'{stock} Stock Price Over Time', markers=True)
        fig1.update_layout(width=1200, height=600)
        fig1.update_xaxes(autorange="reversed")
        graphJSON1 = json.dumps(fig1, cls=plotly.utils.PlotlyJSONEncoder)

        # Generate area chart
        fig2 = px.area(chart_data, x='Date', y='Close', title=f'{stock} Stock Price Area Chart', markers=True)
        fig2.update_layout(width=1200, height=600)
        fig2.update_xaxes(autorange="reversed")
        graphJSON2 = json.dumps(fig2, cls=plotly.utils.PlotlyJSONEncoder)

        # Return all results as JSON
        return jsonify({
            "stock_data": table_data.to_dict(orient='records'),
            "graph_data1": graphJSON1,
            "graph_data2": graphJSON2,
            "chart_period": chart_period,
            "table_period": table_period
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500