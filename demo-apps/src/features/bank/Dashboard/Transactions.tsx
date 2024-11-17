import React from "react";
import Image from "next/image";
import { Icon } from "../Components/Icon";

export const Transactions = () => {
  const transactions = [
    {
      description: "Minimal apps Jan draft",
      date: "Monday 08 May 2023",
      amount: "50,120",
      type: "deposit",
    },
    {
      description: "Mortgage Jubilee Place",
      date: "Thursday 04 May 2023",
      amount: "17,394",
      type: "withdraw",
    },
    {
      description: "Craven Hill Rent",
      date: "Tuesday 02 May 2023",
      amount: "3,670",
      type: "deposit",
    },
  ];

  return (
    <div className="flex w-3/4 flex-col gap-5">
      <div className="flex w-full flex-col rounded-lg border bg-white p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-[18px] font-semibold opacity-50">
              Transactions
            </h3>

            <div className="flex items-center space-x-3">
              <span className="text-[32px] font-medium">
                <>
                  <span>&pound;</span>25,030
                </>
              </span>

              <div className="flex items-center justify-center space-x-1 font-semibold">
                <Icon icon="down-balance" size={18} color="#FF0000" />
                <span className="font-bold text-[#FF0000]">10.55%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="rounded p-2">
              <Icon icon="pie-chart" className="opacity-50" size={24} />
            </div>

            <div className="rounded bg-[#77B212] p-2">
              <Icon icon="trending-up" color="white" size={24} />
            </div>
          </div>
        </div>

        <Image
          src="/images/dashboard-chart.png"
          alt="Chart"
          width={1024}
          height={1024}
          className="w-full cursor-pointer"
          priority
        />
      </div>

      <div className="flex w-full flex-col gap-5 rounded-lg border bg-white p-10">
        {transactions.map((transaction) => {
          const color = transaction.type === "deposit" ? "#98d674" : "#FF0000";
          const icon =
            transaction.type === "deposit" ? "up-balance" : "down-balance";
          const key = transaction.date + transaction.amount;
          return (
            <div key={key} className="flex w-full justify-between">
              <div className="flex items-center space-x-5">
                <div className="rounded bg-[#F2F2F2] p-2">
                  <Icon icon={icon} color={color} size={24} />
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    {transaction.description}
                  </p>
                  <p className="opacity-50">{transaction.date}</p>
                </div>
              </div>

              <span className="text-[22px] font-medium">
                <>
                  <span>&pound;</span>
                  {transaction.amount}
                </>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
