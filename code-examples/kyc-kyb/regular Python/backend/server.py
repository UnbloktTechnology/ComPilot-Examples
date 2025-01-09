from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

codegen_path = os.path.join(os.path.dirname(__file__), 'codegen', 'identity-api-client')
sys.path.insert(0, codegen_path)

from dotenv import load_dotenv
from identity_api_client import AuthenticatedClient
from identity_api_client.models.create_session_body import CreateSessionBody
from identity_api_client.models.create_session_body_additional_information import CreateSessionBodyAdditionalInformation
from identity_api_client.models.create_session_body_additional_information_wallet import CreateSessionBodyAdditionalInformationWallet
from identity_api_client.models.create_session_body_additional_information_wallet_namespace import CreateSessionBodyAdditionalInformationWalletNamespace
from identity_api_client.api.auth import create_session
import httpx



app = Flask(__name__)
CORS(app)

load_dotenv(override=True)

api_base_url = os.getenv("BASE_URL")
api_key = os.getenv("API_KEY")
api_workflow = os.getenv("REGULAR_WORKFLOW_ID")
api_userID = os.getenv("CUSTOMER_ID")
api_userEmail = os.getenv("CUSTOMER_EMAIL")
api_userPhone = os.getenv("CUSTOMER_PHONE")
api_userWalletAddress = os.getenv("CUSTOMER_WALLET_ADDRESS")

def create_additional_info():
    additional_info = CreateSessionBodyAdditionalInformation()
    if api_userEmail:
        additional_info.email = api_userEmail
    if api_userPhone:
        additional_info.phone = api_userPhone
    if api_userWalletAddress:
        additional_info.wallet = CreateSessionBodyAdditionalInformationWallet(
            namespace=CreateSessionBodyAdditionalInformationWalletNamespace.EIP155,
            address=api_userWalletAddress
        )
    return additional_info

@app.route('/create-session', methods=['POST'])
def create_user_session():
    client = AuthenticatedClient(base_url=api_base_url, token=api_key)
    body = CreateSessionBody(
        workflow_id=api_workflow,
        external_customer_id=api_userID,
        additional_information=create_additional_info()
    )

    try:
        kwargs = create_session._get_kwargs(body=body)
        kwargs['headers']['X-API-Key'] = api_key

        if not kwargs['url'].startswith(('http://', 'https://')):
            kwargs['url'] = f"{api_base_url.rstrip('/')}/{kwargs['url'].lstrip('/')}"

        with httpx.Client(verify=False) as http_client:
            response = http_client.request(**kwargs)
        
        if response.status_code == 200:
            session_data = response.json()
            return jsonify({"success": True, "token": session_data.get('token')}), 200
        else:
            return jsonify({"success": False, "error": f"Status code: {response.status_code}", "message": response.content.decode()}), response.status_code

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)