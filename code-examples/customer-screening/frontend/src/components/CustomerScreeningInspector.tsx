import React, { useState } from 'react';
import { CustomerTypeSelectorSection } from './lifecycleinspectorsection/CustomerTypeSelectionSection';
import { JsonEditorSection } from './lifecycleinspectorsection/JsonEditorSection';
import { customerExamples } from '../lib/customer-examples';
import { useCustomerApi, CustomerResponse } from '../hooks/useCustomerApi';
import { useCustomerWebSocket } from '../hooks/useCustomerWebSocket';
import { LogSection } from './lifecycleinspectorsection/LogSection';
import { StatusDisplaySection } from './lifecycleinspectorsection/StatusDisplaySection';

const CustomerScreeningInspector = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(
    JSON.stringify(customerExamples.nationality.eu.data, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<CustomerResponse | null>(null);
  const [externalId, setExternalId] = useState<string | undefined>(undefined);
  const { makeApiCall } = useCustomerApi();
  const { logs } = useCustomerWebSocket(externalId);

  const handleExampleSelect = (category: string, type: string) => {
    if (category === 'nationality') {
      if (type === 'eu') setSelectedCustomer(JSON.stringify(customerExamples.nationality.eu.data, null, 2));
      if (type === 'us') setSelectedCustomer(JSON.stringify(customerExamples.nationality.us.data, null, 2));
    }
    if (category === 'age') {
      if (type === 'over18') setSelectedCustomer(JSON.stringify(customerExamples.age.over18.data, null, 2));
      if (type === 'under18') setSelectedCustomer(JSON.stringify(customerExamples.age.under18.data, null, 2));
    }
    if (category === 'walletRisk') {
      if (type === 'low') setSelectedCustomer(JSON.stringify(customerExamples.walletRisk.low.data, null, 2));
      if (type === 'high') setSelectedCustomer(JSON.stringify(customerExamples.walletRisk.high.data, null, 2));
    }
    if (category === 'amlHits') {
      if (type === 'has') setSelectedCustomer(JSON.stringify(customerExamples.amlHits.has.data, null, 2));
      if (type === 'none') setSelectedCustomer(JSON.stringify(customerExamples.amlHits.none.data, null, 2));
    }
  };

  const handleJsonChange = (value: string) => {
    try {
      JSON.parse(value);
      setJsonError(null);
      setSelectedCustomer(value);
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await makeApiCall(selectedCustomer);
      setApiResponse(response);
      const customerData = JSON.parse(selectedCustomer);
      setExternalId(customerData.customerData[0].externalId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="px-[10vw] py-4">
      <h1 className="text-xl font-bold mb-4"> Customer Screening Workflow</h1>
      
      <div className="grid grid-cols-[1fr,1.618fr] gap-6 mb-6">
        <div className="flex flex-col min-h-[600px] overflow-y-auto">
          <div className="flex-none">
            <CustomerTypeSelectorSection onSelect={handleExampleSelect} />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!!jsonError}
            className="w-1/2 mx-auto px-3 py-3 my-3 text-sm bg-blue-600 text-white rounded disabled:opacity-50 flex-none"
          >
            Submit Customer
          </button>

          <div className="flex-1 overflow-y-auto">
            {apiResponse && <StatusDisplaySection response={apiResponse} />}
            {externalId && <LogSection logs={logs} />}
          </div>
        </div>

        <JsonEditorSection 
          value={selectedCustomer}
          onChange={handleJsonChange}
          error={jsonError}
        />
      </div>
    </div>
  );
};

export default CustomerScreeningInspector; 