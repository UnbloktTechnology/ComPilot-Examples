import React from "react";
import { Icon } from "../Components/Icon";

export const Header = () => {
  const items = [
    {
      amount: "50,090",
      description: "Premier Account",
      percentage: "29.32",
      type: "up",
    },
    {
      amount: "9,900",
      description: "ISA savings",
      percentage: "33.45",
      type: "down",
    },
    {
      amount: "120,012",
      description: "Other savings",
      percentage: "0.00",
      type: "unchanged",
    },
    {
      amount: "3,681,233",
      description: "Mortgage",
      percentage: "2.18",
      type: "down",
    },
  ];

  return (
    <div className="flex max-h-48 w-full items-center justify-between space-x-2 rounded-lg border bg-white p-5">
      {items.map((item, index) => {
        const color =
          item.type === "up"
            ? "#98d674"
            : item.type === "down"
              ? "#2849F5"
              : "#adadad";
        const icon =
          item.type === "up"
            ? "up-balance"
            : item.type === "down"
              ? "down-balance"
              : "arrow-right";

        const key = item.percentage + item.amount + item.description;
        return (
          <div
            key={key}
            className={`flex w-full flex-col gap-2 px-6 text-center ${
              index === items.length - 1 ? "" : "border-r"
            }`}
          >
            <h3 className="text-[30px] font-medium leading-[40px]">
              <>
                <span>&pound;</span>
                {item.amount}
              </>
            </h3>

            <p className="opacity-80">{item.description}</p>

            <div className="flex items-center justify-center space-x-1 font-semibold">
              <Icon icon={icon} color={color} />
              <span className={`text-[${color}]`}>{`${item.percentage}%`}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
