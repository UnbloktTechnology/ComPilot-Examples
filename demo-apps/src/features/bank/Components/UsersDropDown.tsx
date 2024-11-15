import { useState } from "react";
import type { TestUser } from "@/appConfig";
import { Icon } from "./Icon";

interface IDropDown {
  items: readonly TestUser[];
  selected?: TestUser;
  className?: string;
  classNameButton?: string;
  classNameList?: string;
  onSelect: (item: TestUser) => void;
}

export const UsersDropDown = ({
  items,
  selected,
  className = "",
  classNameButton = "",
  classNameList = "",
  onSelect,
}: IDropDown) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (item?: TestUser) => {
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
        className={`inline-flex items-center gap-3 px-3 py-2 shadow-sm ${classNameButton}`}
      >
        {selected?.avatar ? (
          <>
            <Icon icon={selected?.avatar as string} />
            <span className="w-full text-left">{selected?.name}</span>
          </>
        ) : (
          <span>Select user</span>
        )}
        <Icon icon={isOpen ? "condence" : "expand"} color="#000" size={12} />
      </button>
      {isOpen && (
        <div
          className={`absolute top-[35px] z-10 w-full shadow-lg ${classNameList}`}
        >
          <ul className="max-h-52 overflow-y-auto scroll-auto py-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => toggleDropdown(item)}
                onKeyUp={() => toggleDropdown(item)}
              >
                {item.avatar && <Icon icon={item.avatar as string} />}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
