import React, { type ReactNode } from "react";
import { GlobalModals } from "@/features/bank/Modals/GlobalModals";

export const Layout = (props: {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bg?: "default" | "defi";
}) => {
  const {
    children,
    sidebar,
    header,
    footer,
    className,
    bg = "default",
  } = props;
  const background =
    bg === "default" ? "" : "bg-gradient-to-b from-[#202738] to-[#070816]";

  return (
    <main
      className={`scrollable relative mx-auto my-0 h-full min-h-screen w-full ${background}`}
    >
      {sidebar}
      {header}
      <div className={className}>{children}</div>
      {footer && footer}
      <GlobalModals />
    </main>
  );
};
