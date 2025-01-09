from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sock import Sock
from services.compilot import ComPilotService
from dotenv import load_dotenv
import os
import json
from controllers.webhooks import WebhookController

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
    try:
        transaction = request.json
        response = ComPilotService.submit_transaction(transaction)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/webhooks/compilot', methods=['POST'])
def handle_webhook():
    return webhook_controller.handle_webhook(request.json)

@sock.route('/ws')
def websocket(ws):
    ws_connections.add(ws)
    try:
        while True:
            # Keep connection alive
            ws.receive()
    finally:
        ws_connections.remove(ws)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    app.run(port=port, debug=True) 