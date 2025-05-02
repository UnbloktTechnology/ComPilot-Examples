import type { NextApiRequest, NextApiResponse } from 'next';
import { createSdk } from '@compilot/js-sdk';

const apiClient = createSdk({
  webhookSecret: process.env.WEBHOOK_SECRET!,
  apiKey: process.env.API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { workflowType } = req.body;
    console.log('Creating session for workflowType:', workflowType); // Debug log
    
    const workflowId = workflowType === 'KYC' 
      ? process.env.KYC_WORKFLOW_ID 
      : process.env.KYB_WORKFLOW_ID;

    console.log('Using workflow ID:', workflowId); // Debug log

    const sessionRes = await apiClient.createSession({
      workflowId: workflowId!,
      externalCustomerId: `user_${Date.now()}`,
    });

    res.status(200).json(sessionRes);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
} 