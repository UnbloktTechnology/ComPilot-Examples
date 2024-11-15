import { useState } from "react";
import { Icon } from "./Icon";

export interface ITokenInfo {
  value: string | number;
  label: string;
  address: string;
  pairs: ITokensPair[];
  icon?: string;
  decimals?: number;
}

interface ITokensPair {
  value: string;
  address: string;
  swapForY: boolean;
}

interface IDropDown {
  items: readonly ITokenInfo[];
  selected?: ITokenInfo;
  className?: string;
  classNameButton?: string;
  classNameList?: string;
  onSelect: (item: ITokenInfo) => void;
}

export const TokenDropDown = ({
  items,
  selected,
  className = "",
  classNameButton = "",
  classNameList = "",
  onSelect,
}: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);

  if (typeof selected === "undefined") {
    selected = {
      value: "select",
      label: "Select Token",
      pairs: [],
      address: "",
    };
  }

  const initialClass = selected?.value === "select" ? "!bg-[#4C82FB]" : "";

  const toggleDropdown = (item?: ITokenInfo) => {
    setIsOpen(!isOpen);

    if (item) {
      onSelect(item);
    }
  };

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className={`flex w-auto items-center ${className}`}
    >
      <button
        type="button"
        onClick={() => toggleDropdown()}
        className={`inline-flex items-center px-3 py-2 shadow-sm ${classNameButton} ${initialClass}`}
      >
        {selected?.icon && (
          <Icon icon={selected.icon} size={24} className="mr-2" />
        )}
        <span>{selected?.label}</span>
        <Icon icon="expand" size={12} color="#FFFF" className="ml-2 mt-2" />
      </button>
      {isOpen && (
        <div
          className={`absolute top-[68px] z-40 w-full rounded-md shadow-lg ${classNameList}`}
        >
          <ul className="max-h-52 overflow-y-auto scroll-auto py-1">
            {items.map((item) => (
              <li
                key={item.value}
                className="flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => toggleDropdown(item)}
              >
                {/* {item.icon && (
                  <Icon icon={item.icon} size={24} className="mr-2" />
                )} */}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
