import React, { type ReactNode } from "react";
import { GlobalModals } from "@/features/bank-web3/Modals/GlobalModals";

export const Layout = (props: {
  children: ReactNode;
  isCompliant?: boolean;
  className?: string;
  header: ReactNode;
  bg?: "default" | "defi";
}) => {
  const { children, header, className, bg = "default" } = props;
  const background =
    bg === "default" ? "" : "bg-gradient-to-b from-[#202738] to-[#070816]";

  return (
    <main
      className={`relative mx-auto my-0 h-full max-h-screen min-h-screen w-full overflow-hidden ${background}`}
      style={{
        backgroundImage: "url(/images/SideDesign.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {header}
      <div className={className}>{children}</div>
      <GlobalModals />
    </main>
  );
};
