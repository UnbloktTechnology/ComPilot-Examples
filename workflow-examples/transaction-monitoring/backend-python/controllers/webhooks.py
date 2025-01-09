from flask import jsonify
import json

class WebhookController:
    def __init__(self, ws_connections):
        self.ws_connections = ws_connections

    def handle_webhook(self, webhook_data):
        try:
            # Broadcast to all connected websockets
            for ws in self.ws_connections:
                ws.send(json.dumps({
                    'transactionId': webhook_data.get('transactionId'),
                    'status': webhook_data.get('status'),
                    'message': webhook_data.get('message')
                }))
            
            return jsonify({'received': True}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400 