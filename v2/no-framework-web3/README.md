
NexeraID widget integration example : for Javascript in Web3 mode. 
===========================================================

This example demonstrates how to integrate the NexeraID Widget for KYC (Know Your Customer) and KYB (Know Your Business) processes. In this implementation, the widget initialization requires a wallet signature. For this example, we’ve used Wallect connect for wallet management. However, note that Wallet connect is not a project dependency and the NexeraID widget is compatible with any wallet adapter of your choice.

## pre-requisite :

To run this example App, you need:
	•	Access to the NexeraID dashboard with an API key.
	•	A workflow set up in your workspace.


## running the sample :

1. Install dependencies for frontend and backend :

~~~~

cd nexeraid-examples/v2/no-framework-web3/frontend 
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
NexeraID KYC/KYB documentation : https://docs.compilot.ai/usescases/
NexeraID technical documentation :   https://docs.compilot.ai/developing

## Credits :

This is a [NexeraID] (https://nexera.id) + [Wallet Connect] (https://walletconnect.com/) project