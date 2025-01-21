from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sock import Sock
from services.compilot import ComPilotService
from dotenv import load_dotenv
import os
import json
from controllers.webhooks import WebhookController

"""
ComPilot Transaction Monitoring System - Python Backend Server

This server provides:
1. REST API endpoints for transaction submission
2. Webhook endpoints for receiving ComPilot updates
3. WebSocket server for real-time updates to clients

Required environment variables:
- PORT: Server port (default: 8080)
- WEBHOOK_SECRET: ComPilot webhook signing secret
- COMPILOT_API_URL: ComPilot API base URL
- COMPILOT_API_KEY: ComPilot API key
"""

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
sock = Sock(app)

# WebSocket connections store
ws_connections = set()

# Initialize controllers
webhook_controller = WebhookController(ws_connections)

@app.route('/api/transactions', methods=['POST'])
def submit_transaction():
    """
    Submit a new transaction to ComPilot.
    
    Expected request format:
    {
        "transactionType": "crypto",
        "transactionSubType": "wallet transfer",
        "transactionInfo": {
            "direction": "IN",
            "amount": 0.5,
            "currencyCode": "ETH"
        }
    }
    
    Returns:
        200: Transaction created successfully
        400: Invalid request data
    """
    try:
        transaction = request.json
        print(f"[/api/transactions] Received transaction: {json.dumps(transaction, indent=2)}")
        response = ComPilotService.submit_transaction(transaction)
        print(f"[/api/transactions] ComPilot response: {json.dumps(response, indent=2)}")
        return jsonify(response), 200
    except Exception as e:
        print(f"[/api/transactions] Error: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/webhooks/compilot', methods=['POST'])
def handle_webhook():
    """
    Handle incoming webhooks from ComPilot.
    Verifies webhook signatures and broadcasts to WebSocket clients.
    
    Expected headers:
    - svix-id: Webhook ID
    - svix-timestamp: Webhook timestamp
    - svix-signature: Webhook signature
    
    Returns:
        200: Webhook processed successfully
        400: Invalid webhook data
    """
    try:
        print(f"[DEBUG] Webhook received at: {request.path}")
        print(f"[DEBUG] Headers: {dict(request.headers)}")
        
        return webhook_controller.handle_webhook(request.json)
    except Exception as e:
        print(f"[ERROR] Webhook failed: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/', methods=['POST'])
def root_webhook():
    """
    Root webhook endpoint for ngrok testing.
    Forwards webhooks to the main webhook handler.
    """
    try:
        print(f"[DEBUG] Webhook received at root, redirecting to /api/webhooks/compilot")
        return webhook_controller.handle_webhook(request.json, request.headers)
    except Exception as e:
        print(f"[ERROR] Root webhook failed: {str(e)}")
        return jsonify({'error': str(e)}), 400

@sock.route('/ws')
def websocket(ws):
    """
    WebSocket endpoint for real-time updates.
    Maintains client connections and broadcasts webhook events.
    """
    print(f"[/ws] New WebSocket connection")
    ws_connections.add(ws)
    try:
        while True:
            data = ws.receive()
            print(f"[/ws] Received message: {data}")
    finally:
        print(f"[/ws] Connection closed")
        ws_connections.remove(ws)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True) 