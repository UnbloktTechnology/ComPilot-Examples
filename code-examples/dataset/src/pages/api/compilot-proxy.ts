import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { method, endpoint, body, params } = req.body;

    if (!method || !endpoint) {
      return res.status(400).json({ error: 'Missing required parameters: method and endpoint' });
    }

    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl || !apiKey) {
      return res.status(500).json({ error: 'API configuration missing' });
    }

    // Construire l'URL finale en remplaçant les paramètres
    let finalEndpoint = endpoint;
    if (params) {
      Object.keys(params).forEach(key => {
        finalEndpoint = finalEndpoint.replace(`{${key}}`, params[key]);
      });
    }

    const url = `${apiUrl}${finalEndpoint}`;
    
    const options: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    };

    // Ajouter le body seulement pour les méthodes qui en ont besoin
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    // Log de l'appel API vers Compilot
    console.log('=== COMPILOT API CALL ===');
    console.log('URL:', url);
    console.log('Method:', method);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'X-api-key': '[HIDDEN]'
    });
    if (body) {
      console.log('Body:', JSON.stringify(body, null, 2));
    }
    console.log('========================');

    const response = await fetch(url, options);
    const data = await response.json();

    // Log de la réponse
    console.log('=== COMPILOT API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('============================');

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in compilot proxy:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 