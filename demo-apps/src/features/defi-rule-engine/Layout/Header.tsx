import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Icon } from "../Components/Icon";

export const Header = () => {
  const navItems = ["Swap", "Tokens", "NFTs", "Pool"];

  const handleNav = (nav: string) => {
    console.log("NavID: ", nav);
  };

  const handleSearch = (search: string) => {
    console.log("Search: ", search);
  };

  return (
    <>
      <div className="relative z-30 flex h-20 w-full items-center justify-between p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="align-center flex">
            <Icon icon="uniswap" size={40} className="mr-2" />
          </div>

          <nav className="flex items-center">
            <ul className="m-0 flex p-0">
              {navItems.map((item) => (
                <li key={item} className="ml-10">
                  <button
                    type="button"
                    className="bold cursor-pointer text-white"
                    onClick={() => handleNav(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="box-border flex h-11 w-[480px] items-center rounded-xl border-[#ffffff12] bg-[#ffffff12] p-4">
          <Icon icon="nav-search" className="p-1" />

          <input
            type="text"
            placeholder="Search Tokens and NFT collections"
            className="w-full border-transparent bg-transparent px-1 text-white"
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* <Icon icon="enter" className="p-1" /> */}
        </div>

        <ConnectButton />
      </div>
    </>
  );
};
