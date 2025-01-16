export interface ComPilotCustomer {
  id: string;
  status: 'Active' | 'Pending' | 'Rejected';
  walletAddress: string;
  // Add other fields if needed
} 