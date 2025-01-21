import os
import requests
from dotenv import load_dotenv

"""
Service for interacting with the ComPilot API.
Handles transaction submissions and API communication.

Required environment variables:
- COMPILOT_API_URL: Base URL for the ComPilot API
- COMPILOT_API_KEY: API key for authentication
- COMPILOT_TMS_WORKFLOW_ID: Workflow ID for transaction monitoring
"""

load_dotenv()

class ComPilotService:
    @staticmethod
    def submit_transaction(transaction):
        """
        Submits a transaction to the ComPilot API for processing.
        
        Args:
            transaction: Dictionary containing transaction details
            
        Returns:
            Dictionary containing the API response
            
        Raises:
            Exception: If API credentials are missing or if the API request fails
        """
        try:
            workflow_id = os.getenv('COMPILOT_TMS_WORKFLOW_ID')
            if not workflow_id:
                raise Exception('COMPILOT_TMS_WORKFLOW_ID is not defined')

            response = requests.post(
                f"{os.getenv('COMPILOT_API_URL')}/workflows/{workflow_id}/transactions",
                json=transaction,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f"Bearer {os.getenv('COMPILOT_API_KEY')}"
                }
            )
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            if e.response is not None:
                error_data = e.response.json()
                raise Exception(f"ComPilot API Error: {error_data}")
            raise Exception(f"ComPilot API Error: {str(e)}") 