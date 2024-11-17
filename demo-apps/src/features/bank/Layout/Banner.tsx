import Image from "next/image";
import { Button } from "../Components/Button";

export const Banner = () => {
  return (
    <div className="relative flex h-full w-full justify-between space-x-5 overflow-y-hidden">
      <div className="relative w-4/5 pr-5">
        <Image
          src="/images/hsbc-banner.jpg"
          alt="Banner"
          width={975}
          height={420}
          className="w-full"
          priority
        />

        <div className="absolute left-14 top-1/2 w-6/12 -translate-y-1/2 space-y-9 bg-white px-8 py-6">
          <h3 className="text-4xl">Have £200 on us...</h3>
          <p className="text-base">
            ...just switch to a qualifying current account using the Current
            Account Switch Service within 30 days.
          </p>
          <p className="text-base">
            New customers only. Further eligibility and T&Cs apply. Deposit
            £1,500 within 60 days of account opening.
          </p>
          <Button>Find out more</Button>
        </div>
      </div>

      <div className="absolute right-0 flex h-full w-1/5 flex-col gap-6 bg-[#3E505D] p-5 text-white">
        <div>
          <h3 className="w-60 text-3xl">
            Global Money Account <span className="text-xl">&gt;</span>
          </h3>
          <p className="text-base">
            A new way to send and spend abroad. Eligibility criteria apply.
          </p>
        </div>
        <hr />
        <div>
          <h3 className="w-60 text-3xl">
            Mobile banking <span className="text-xl">&gt;</span>
          </h3>
          <p className="text-base">
            Our secure app makes it easy for you to stay on top of your money.
          </p>
        </div>
      </div>
    </div>
  );
};
