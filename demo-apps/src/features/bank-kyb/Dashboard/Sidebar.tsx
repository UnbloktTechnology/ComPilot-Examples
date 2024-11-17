import React, { useState } from "react";
import { Icon } from "../Components/Icon";
import { useMockBankKybAuth } from "../identity/useMockBankKybAuth";

interface ItemGroup {
  name: string;
  icon: string;
  onClick: () => void;
}

const UserOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useMockBankKybAuth();

  if (!user) return <></>;

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className="relative mt-5 flex w-full items-center"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-auto w-full items-center justify-between px-3 py-2 shadow-sm"
      >
        <div className="flex w-full cursor-pointer items-center space-x-4">
          {user?.avatar && <button className="mr-2">{user.avatar}</button>}
          <span className="font-semibold">{user.name}</span>
        </div>

        <Icon icon="expand" />
      </button>
      {isOpen && (
        <div className="absolute bottom-[0px] z-10 w-full border bg-white shadow-xl">
          <ul className="max-h-52 overflow-y-auto scroll-auto py-1">
            <li
              className="flex h-14 cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => {
                logout.mutate();
                setIsOpen(false);
              }}
            >
              Log Out
            </li>

            <li
              className="m-2 flex cursor-pointer items-center border-t px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex w-full cursor-pointer items-center space-x-4">
                {user?.avatar && (
                  <button className="mr-2">{user.avatar}</button>
                )}
                <span className="font-semibold">{user.name}</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const MenuItems = ({ itemGroup }: { itemGroup: ItemGroup[] }) => {
  return (
    <ul className="w-full text-black">
      {itemGroup.map((item, index) => (
        <li
          id={
            item.name === "Manage identity" ? "kyc-btn-management" : item.name
          }
          key={item.name + index.toString()}
          className={`flex h-14 w-full cursor-pointer items-center space-x-4 rounded-lg p-5 font-semibold hover:bg-[#77B212] hover:text-white ${
            item.name === "Overview" ? "bg-[#77B212] text-white" : ""
          }`}
          onClick={item.onClick}
        >
          <Icon icon={item.icon} size={24} />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export const Sidebar = () => {
  const menuItems = {
    main: [
      {
        icon: "inbox",
        name: "Inbox",
        onClick: () => console.log("Inbox"),
      },
      {
        icon: "donut-graph",
        name: "Overview",
        onClick: () => console.log("Overview"),
      },
      {
        icon: "bolt",
        name: "Notifications",
        onClick: () => console.log("Notifications"),
      },
    ],
    services: [
      {
        icon: "home",
        name: "Mortgage",
        onClick: () => console.log("Mortgage"),
      },
      {
        icon: "car",
        name: "Car loans",
        onClick: () => console.log("Car loans"),
      },
      {
        icon: "helmet",
        name: "Insurance",
        onClick: () => console.log("Insurance"),
      },
    ],
    investments: [
      {
        icon: "trade",
        name: "Stocks trade",
        onClick: () => console.log("Stocks trade"),
      },
      {
        icon: "chat",
        name: "Finance advice",
        onClick: () => console.log("Finance advice"),
      },
      {
        icon: "savings",
        name: "Savings accounts",
        onClick: () => console.log("Savings accounts"),
      },
      {
        icon: "badge",
        name: "Manage identity",
        onClick: () => console.log("Manage identity"),
      },
    ],
  };

  return (
    <div className="w-1/5">
      <div className=" flex flex-col gap-10">
        <div className="flex w-full flex-col gap-4 rounded-lg border bg-white p-5">
          <MenuItems itemGroup={menuItems.main} />

          <span className="opacity-70">Services</span>
          <MenuItems itemGroup={menuItems.services} />

          <span className="opacity-70">Investments</span>
          <MenuItems itemGroup={menuItems.investments} />

          <UserOptions />
        </div>
      </div>
    </div>
  );
};
