
Compilot widget integration example : for React in regular mode. 
===========================================================

This example demonstrates how to integrate the Compilot Widget for KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, we uses react and a customer ID. 

## pre-requisite :

To run this example dApp, you need:
	•	Access to the Compilot dashboard with an API key.
	•	A workflow set up in your workspace.
	•	To authenticate a user before opening a Compilot session and be able to provide a unique ID for this user (such as an email address or any other ID).


## running the sample :

1. Install dependencies for frontend and backend :

~~~~

cd compilot-examples/v2/react-regular/frontend 
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
Compilot KYC/KYB documentation : https://docs.compilot.ai/usescases/
Compilot technical documentation :   https://docs.compilot.ai/developing

## Credits :

This is a [Compilot] (https://compilot.ai)+ [React](https://react.dev/) project