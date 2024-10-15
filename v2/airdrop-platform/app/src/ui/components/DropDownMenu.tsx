import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const DropDownContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsOpen: () => {},
});

export const DropDownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen }),
    [isOpen, setIsOpen],
  );
  return (
    <DropDownContext.Provider value={contextValue}>
      <div className="relative inline-block text-left">{children}</div>
      <div
        className="fixed inset-0 z-10 "
        style={{ display: isOpen ? "block" : "none" }}
        onClick={() => setIsOpen(false)}
      />
    </DropDownContext.Provider>
  );
};

const Button = ({ children }: { children: React.ReactNode }) => {
  const { setIsOpen } = useContext(DropDownContext);

  const handleClick = useCallback(() => {
    setIsOpen((open) => !open);
  }, [setIsOpen]);

  return (
    <button
      type="button"
      className="block w-full cursor-pointer px-4 py-2 text-left text-sm"
      role="menuitem"
      tabIndex={-1}
      id="menu-item-3"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
DropDownMenu.Button = Button;

const DropDown = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useContext(DropDownContext);
  return (
    <div
      className="absolute right-0 z-20 w-56 origin-top-right rounded-md  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>
  );
};
DropDownMenu.DropDown = DropDown;

const Item = ({
  children,
  selectable = true,
  onClick,
}: {
  children: React.ReactNode;
  selectable?: boolean;
  onClick?: () => void;
}) => {
  const clickHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    },
    [onClick],
  );
  return (
    <a
      href="#"
      className={
        "text-gray-70 block px-4 py-2 text-sm" +
        (selectable ? " hover:bg-gray-100 hover:text-gray-900" : "")
      }
      role="menuitem"
      tabIndex={-1}
      id="menu-item-0"
      onClick={clickHandler}
    >
      {children}
    </a>
  );
};
DropDownMenu.Item = Item;
