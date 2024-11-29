import { EvmChainId } from "@nexeraid/identity-schemas";
import { createSdk } from "@compilot/js-sdk";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { address } = req.body;

        if (!process.env.COMPILOT_API_KEY_LANDING_KYB) {
            throw new Error('COMPILOT_API_KEY_LANDING_KYB is not defined');
        }

        const apiClient = createSdk({
            apiKey: process.env.COMPILOT_API_KEY_LANDING_KYB,
        });

        if (!process.env.COMPILOT_WORKFLOW_ID_LANDING_KYB) {
            throw new Error('COMPILOT_WORKFLOW_ID_LANDING_KYB is not defined');
        }

        const challenge = await apiClient.createWeb3Challenge({
            workflowId: process.env.COMPILOT_WORKFLOW_ID_LANDING_KYB,
            address,
            blockchainId: EvmChainId.parse('1'),
            namespace: 'eip155',
            origin: process.env.COMPILOT_ORIGIN_LANDING_KYB ?? '',
        });

        return res.status(200).json(challenge);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create challenge' });
    }
}