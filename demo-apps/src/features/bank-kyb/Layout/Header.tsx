import React from "react";
import Link from "next/link";
import { Icon } from "../Components/Icon";

export const Header = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  const items = [
    { title: "Banking", subtitle: "Accounts & services" },
    { title: "Borrowing", subtitle: "Short & long-term" },
    { title: "Investing", subtitle: "Products & planning" },
    { title: "Insurance", subtitle: "Property & family" },
    { title: "Wellbeing", subtitle: "Financial health & support" },
    { title: "Help", subtitle: "Service & security" },
  ];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="bold flex h-9 w-full items-center justify-between bg-[#000] px-[105px] text-white">
        <ul className="m-0 flex h-full p-0">
          <li className="flex cursor-pointer items-center font-bold">
            <Link href="#personal" className="border-r px-2">
              Personal
            </Link>
          </li>
          <li className="flex cursor-pointer items-center">
            <Link href="#business" className="px-2">
              Business
            </Link>
          </li>
        </ul>

        <ul className="m-0 flex h-full items-center p-0">
          <li
            className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white"
            onClick={() => console.log("Laguage")}
          >
            English
          </li>
          <li
            className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white"
            onClick={() => console.log("Register")}
          >
            Register &gt;
          </li>
          <li
            className="flex h-full w-24 cursor-pointer items-center justify-center bg-[#77B212] hover:bg-[#cf313e]"
            onClick={onClickLogOn}
          >
            Log in
          </li>
        </ul>
      </div>

      <div className="flex w-full items-center px-[105px] py-6">
        <Icon icon="green-bank" size={50} className="!h-auto max-h-16" />
        <h1 className="ml-2 font-bold">Green Bank</h1>
        <div className="flex w-full justify-between">
          {items.map((item, index) => (
            <div
              key={index}
              className={`ml-10 w-full px-6 ${
                index === items.length - 1 ? "" : "border-r"
              }`}
            >
              <h3 className="text-lg">{item.title}</h3>
              <p className="text-xs">{item.subtitle}</p>
            </div>
          ))}
          <div className="w-14" />
        </div>
      </div>
    </div>
  );
};
