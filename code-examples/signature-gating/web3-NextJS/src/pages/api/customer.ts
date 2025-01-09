import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  try {
    const response = await fetch(
      `https://api.compilot.ai/projects/${process.env.COMPILOT_PROJECT_ID}/customer-wallets/${address}/customer`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
        }
      }
    );
    
    if (response.status === 404) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
} 