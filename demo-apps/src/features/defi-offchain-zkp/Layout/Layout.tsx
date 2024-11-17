import { type ReactNode } from "react";
import { GlobalModals } from "@/features/defi-offchain-zkp/Modals/GlobalModals";

export type BackgroundType = "default" | "defi";

interface ILayout {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bg?: BackgroundType;
}

export const Layout = ({
  children,
  sidebar,
  footer,
  header,
  className = "",
  bg = "default",
}: ILayout) => {
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
