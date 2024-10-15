ComPilot widget integration example : Python Backend and javascript frontend in regular mode. 
===========================================================

This example demonstrates how to build a Python backend API and a JavaScript frontend for the ComPilot Widget in regular mode, which can be applied to KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, no SDK is used. Instead, we used the OpenAPI generator (https://github.com/openapi-generators/openapi-python-client) to generate the identity-api-client codegen folder.

The regular mode backend example requires a customer ID as an environment variable to illustrate the integration. However, in a real-world scenario, a unique customer ID should be passed as a parameter when initiating KYC/KYB verification.


## pre-requisite :

To run this example dApp, you need:
	•	Access to the ComPilot dashboard with an API key.
	•	A workflow set up in your workspace.
	•	User authentication before opening a ComPilot session, with a unique ID for this user (such as an email address or another ID).
   .   Python 3.x
   .   pip
   .   virtualenv (recommended)

## running the sample :

1. go the backend the repository:
   ~~~~
   cd [yourPath]/python-js/backend
   ~~~~

2. Create and activate a virtual environment:
   ~~~~
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ~~~~

3. Install dependencies:
   ~~~~
   pip install -r requirements.txt
   ~~~~

## Configuration

4. Copy the `.env.example` file to `.env`:
   ~~~~
   cp .env.example .env
   ~~~~

5. Modify the `.env` file with your own settings.

6. Go to frontend
   ~~~~
   cd ../frontend
   ~~~~

6. install depencies
   ~~~~
   npm i @compilot/web-sdk 
   ~~~~


## Running the servers

from the backend folder, to start the development backend server: 

~~~~

python3 server.py

~~~~

from the frontend folder, to start the development frontend server: 

~~~~

npm run dev

~~~~

## API Endpoints

@app.route('/create-session', methods=['POST'])

## For more details, visit : 

SDKs documentation : https://docs.compilot.ai/developing/sdk/
ComPilot KYC/KYB documentation : https://docs.compilot.ai/usescases/
ComPilot technical documentation :   https://docs.compilot.ai/developing

## Credits :

This is a [ComPilot] (https://compilot.ai) project