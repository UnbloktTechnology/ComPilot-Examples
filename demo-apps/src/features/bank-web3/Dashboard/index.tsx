import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Transactions } from "./Transactions";
import { Transfer } from "./Transfer";
import { Card } from "./Card";

export const Dashboard = () => {
  return (
    <div className="flex max-h-screen space-x-5 overflow-y-auto p-10">
      <Sidebar />

      <div className="flex h-full w-full flex-col gap-5">
        <Header />

        <div className="flex space-x-5">
          <Transactions />

          <div className="flex h-full w-1/4 flex-col gap-5">
            <Transfer />

            <Card />
          </div>
        </div>
      </div>
    </div>
  );
};
