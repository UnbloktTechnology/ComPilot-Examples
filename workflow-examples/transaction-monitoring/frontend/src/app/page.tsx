'use client';

import { useState } from 'react';
import TransactionPage from '@/components/TransactionPage';
import DevMode from '@/components/DevMode';

export default function Home() {
  const [isDevMode, setIsDevMode] = useState(false);

  return (
    <>
      {isDevMode ? <DevMode /> : <TransactionPage />}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsDevMode(!isDevMode);
        }}
        className="fixed bottom-4 right-4 bg-[#2C2F36] hover:bg-[#363A41] text-gray-300 px-4 py-2 rounded-lg text-sm"
      >
        {isDevMode ? 'UX Mode' : 'Developer Mode'}
      </a>
    </>
  );
}
