ComPilot widget integration example : for JS in regular mode. 
===========================================================

This example demonstrates how to integrate the ComPilot Widget for KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, we uses no framework and a customer ID as an environment variable to illustrate the integration.

## pre-requisite :

To run this example dApp, you need:
	•	Access to the ComPilot dashboard with an API key.
	•	A workflow set up in your workspace.
	•	User authentication before opening a ComPilot session, with a unique ID for this user (such as an email address or another ID).



## running the sample :

1. Install dependencies for frontend and backend :

~~~~

cd compilot-examples/v2/no-framework-regular/frontend 
npm install
cd ../backend
npm install

~~~~

2) Copy .env.example and rename it to .env :

~~~~

cp .env.example .env 

~~~~

3) Fill out all required variables in the .env file.

4) Start the servers.

~~~~

npm start
cd ../frontend
npm dev

~~~~

## For more details, visit : 

SDKs documentation : https://docs.compilot.ai/developing/sdk/
ComPilot KYC/KYB documentation : https://docs.compilot.ai/usescases/
ComPilot technical documentation :   https://docs.compilot.ai/developing

## Credits :

This is a [ComPilot] (https://compilot.ai) project