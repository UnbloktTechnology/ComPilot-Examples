import React from "react";
import Link from "next/link";

export const Header = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="bold flex h-16 w-full items-center justify-between px-[140px] text-[#1C1B54]">
        <ul className="m-0 flex h-full items-center gap-6 p-0">
          <li className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white">
            <Link href="/" className="text-5xl">
              💰
            </Link>
            <Link href="/" className="ml-4 text-xl font-bold">
              Payee
            </Link>
          </li>
        </ul>
        <ul className="m-0 flex h-full items-center gap-6 p-0">
          <li
            className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white"
            onClick={() => console.log("Laguage")}
            onKeyUp={() => console.log("Laguage")}
          >
            About
          </li>
          <li
            className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white"
            onClick={() => console.log("Register")}
            onKeyUp={() => console.log("Register")}
          >
            Product
          </li>
          <li
            className="hover:text-cta-black flex h-full w-24 cursor-pointer items-center justify-center hover:bg-white"
            onClick={() => console.log("Register")}
            onKeyUp={() => console.log("Register")}
          >
            Pricing
          </li>
          <li
            className="flex w-32 cursor-pointer items-center justify-center rounded-full bg-[#1C1B54] px-4 py-2 text-white hover:bg-white hover:text-[#1C1B54]"
            onClick={onClickLogOn}
            onKeyUp={onClickLogOn}
          >
            Sign Up
          </li>
        </ul>
      </div>
    </div>
  );
};
