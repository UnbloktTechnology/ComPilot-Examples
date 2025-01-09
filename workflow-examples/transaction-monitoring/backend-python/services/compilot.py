import os
import requests
from dotenv import load_dotenv

load_dotenv()

class ComPilotService:
    @staticmethod
    def submit_transaction(transaction):
        try:
            response = requests.post(
                f"{os.getenv('COMPILOT_API_URL')}/transactions",
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