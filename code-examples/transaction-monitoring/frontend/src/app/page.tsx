'use client';

import { useState } from 'react';
import TransactionLifeCycleInspector from '@/components/TransactionLifecycleInspector';
import TransactionPage from '@/components/UXDemo';

const Page = () => {
  const [isTransactionLifeCycleInspector, setIsDevMode] = useState(true); // Default to DevMode

  return (
    <>
      {isTransactionLifeCycleInspector ? <TransactionLifeCycleInspector /> : <TransactionPage />}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsDevMode(!isTransactionLifeCycleInspector);
        }}
        className="fixed bottom-4 right-4 bg-[#2C2F36] hover:bg-[#363A41] text-gray-300 px-4 py-2 rounded-lg text-sm"
      >
        {isTransactionLifeCycleInspector ? 'UX Mode' : 'Developer Mode'}
      </a>
    </>
  );
};

export default Page;
