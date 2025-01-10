import hmac
import hashlib
import os
from flask import jsonify, request
import json
import base64

class WebhookController:
    """
    Controller to handle ComPilot webhooks.
    Verifies Svix signatures and broadcasts events via WebSocket.
    
    Required environment variables:
    - WEBHOOK_SECRET: The webhook signing secret from ComPilot
    
    Example webhook format:
    {
        "type": "transaction.updated",
        "payload": {
            "transactionId": "tx_123...",
            "status": "pending",
            ...other fields
        }
    }
    """

    def __init__(self, ws_connections):
        """
        Initialize the webhook controller.
        
        Args:
            ws_connections: Set of active WebSocket connections for broadcasting
        """
        self.ws_connections = ws_connections
        self.webhook_secret = os.getenv('WEBHOOK_SECRET')

    def verify_signature(self, payload, headers, raw_payload):
        """
        Verifies the Svix webhook signature.
        
        Args:
            payload: The parsed webhook payload
            headers: Request headers containing Svix signature details
            raw_payload: The raw request payload as string
            
        Returns:
            bool: True if signature is valid or no secret configured
            
        Note:
            If WEBHOOK_SECRET is not set, verification is skipped
        """
        try:
            if not self.webhook_secret:
                return True

            svix_id = headers.get('Svix-Id')
            svix_timestamp = headers.get('Svix-Timestamp')
            svix_signature = headers.get('Svix-Signature')

            if not all([svix_id, svix_timestamp, svix_signature]):
                return False

            # Build and verify signature
            message = f"{svix_id}.{svix_timestamp}.{raw_payload}".encode()
            secret_key = self.webhook_secret.replace('whsec_', '')
            secret_bytes = base64.b64decode(secret_key)
            
            computed_signature = base64.b64encode(
                hmac.new(secret_bytes, message, hashlib.sha256).digest()
            ).decode()

            expected_signature = svix_signature.split(',')[1]
            return hmac.compare_digest(computed_signature, expected_signature)

        except Exception as e:
            print(f"[ERROR] Signature verification failed: {str(e)}")
            return False

    def handle_webhook(self, data, headers=None):
        """
        Handles incoming webhooks and broadcasts via WebSocket.
        
        Args:
            data: The webhook payload
            headers: Request headers for signature verification
            
        Returns:
            Flask response with status 200 if successful
            
        Raises:
            Exception: If webhook processing fails
        """
        try:
            print(f"[DEBUG] Webhook data: {json.dumps(data, indent=2)}")
            print(f"[DEBUG] Webhook headers: {headers}")
            raw_payload = request.get_data(as_text=True)
            print(f"[DEBUG] Raw payload: {raw_payload}")

            if not self.verify_signature(data, headers, raw_payload):
                return jsonify({'error': 'Invalid signature'}), 401

            # Broadcast to WebSocket clients
            for ws in self.ws_connections:
                ws.send(json.dumps(data))

            return jsonify({'status': 'ok'}), 200
        except Exception as e:
            print(f"[Webhook] Error: {str(e)}")
            return jsonify({'error': str(e)}), 400 