import Image from "next/image";
import React from "react";

export const Content = ({ onClickLogOn }: { onClickLogOn: () => void }) => {
  return (
    <div className="grid grid-cols-8 gap-6">
      <div className="col-span-5 flex justify-end">
        <Image
          src={"/images/Card.png"}
          width={600}
          height={800}
          alt=""
          className="h-fit w-8/12"
        />
      </div>

      <div className="col-span-3 my-auto">
        <div className="flex items-center gap-4">
          <span className="text-4xl ">💰</span>
          <span className="font-medium text-[#2A9206]">
            START SAVING YOUR MONEY SMARTLY
          </span>
        </div>
        <div className="text-6xl font-bold leading-[75px] text-[#1C1B54]">
          Payments <br />
          have never <br />
          been easier
        </div>
        <div className="my-8 text-lg text-[#4E4CB7]">
          Discover the easiest and smartest way to manage your personal
          finances. Save, analyse, invest, withdraw, send, and receive money all
          over world with no limit.
        </div>
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex w-32 cursor-pointer items-center justify-center rounded-full bg-[#4E4CB7] px-4 py-2 text-white hover:bg-white hover:text-[#4E4CB7]"
            onClick={onClickLogOn}
            onKeyUp={onClickLogOn}
          >
            Get started
          </button>
          <button
            type="button"
            className="flex w-48 cursor-pointer items-center justify-center gap-3 px-4 py-2 text-[#4E4CB7]"
          >
            <Image
              src={"/images/bi_download.png"}
              width={16}
              height={16}
              alt=""
            />
            <span>Download App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
