import React from "react";
import { Icon } from "../Components/Icon";

const TransferInput = ({
  label,
  prependIcon,
}: {
  label: string;
  prependIcon: string;
}) => {
  return (
    <button
      type="button"
      className="inline-flex w-full items-center rounded border px-3 py-2"
    >
      <span className="w-full text-left font-semibold">{label}</span>

      <div className="ml-2 mt-1 rounded bg-[#F2F2F2] p-2 pt-3">
        <span className="font-semibold opacity-50">{prependIcon}</span>

        <Icon icon="expand" color="#000" size={12} />
      </div>
    </button>
  );
};

export const Transfer = () => {
  const inputs = [
    {
      label: "From",
      prepend: "",
    },
    {
      label: "To",
      prepend: "",
    },
    {
      label: "Amount",
      prepend: "",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border bg-white p-10">
      <h3 className="text-[18px] font-semibold opacity-50">Quick transfer</h3>

      {inputs.map((input) => (
        <TransferInput
          key={input.label}
          label={input.label}
          prependIcon={input.prepend}
        />
      ))}
    </div>
  );
};
