import React from "react";
import { Icon } from "../Components/Icon";

export const Card = () => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border bg-[#2849F5] p-10">
      <h3 className="text-[18px] font-semibold text-white">Cards</h3>

      <div className="flex w-full flex-col gap-5 rounded-lg border border-dashed p-5">
        <div className="flex items-center justify-between">
          <Icon icon="sim-card-chip" size={32} />
        </div>

        <div className="flex justify-between text-[32px] font-extrabold text-white">
          <span>....</span>
          <span>....</span>
          <span>....</span>
          <span>....</span>
        </div>

        <div className="flex justify-between text-white">
          <p>Full name</p>
          <p>mm / aa</p>
        </div>

        <button className="rounded-xl border-none !bg-white p-4 !text-[#2849F5]">
          Active card
        </button>
      </div>
    </div>
  );
};
