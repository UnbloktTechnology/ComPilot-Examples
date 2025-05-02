import { useState } from 'react';

interface CustomerData {
  workspaceId: string;
  organizationId: string;
  workflowId: string;
  customerPersonalInformation: {
    age: number;
    nationality: string;
    residence: string;
  };
  customerData: Array<{
    customerWallet: {
      wallet: string;
      blockchainNamespace: string;
      verified: boolean;
    };
  }>;
  contactInformation: {
    email: string;
    phone: string;
  };
  customerPersonalData: {
    credentials: Array<Record<string, unknown>>;
    requestIp: string;
    address: string;
    cmsProjectId: string;
  };
}

export interface CustomerResponse {
  msg: string;
  externalSessionId: string;
}

type ApiLog = {
  apiRequest?: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: CustomerData;
  };
  apiResponse?: {
    status: number;
    body: { id: string; status: string };
  };
  id?: string;
};

export const useCustomerApi = () => {
  const [apiLog, setApiLog] = useState<ApiLog>({});

  const makeApiCall = async (customer: string) => {
    const parsedCustomer = JSON.parse(customer);
    console.log('Customer payload:', parsedCustomer);

    const apiRequest = {
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: parsedCustomer
    };

    setApiLog({ apiRequest });

    const response = await fetch(apiRequest.url, {
      method: apiRequest.method,
      headers: apiRequest.headers,
      body: JSON.stringify(apiRequest.body)
    });

    const data = await response.json();
    
    setApiLog(prev => ({
      ...prev,
      id: data.id,
      apiResponse: {
        status: response.status,
        body: data
      }
    }));

    if (!response.ok) {
      throw new Error(data.error || 'Customer screening failed');
    }

    return data;
  };

  return { makeApiCall, apiLog };
}; 