import React, { type ReactNode } from "react";
import Image from "next/image";
import stylesPeaq from "./peaq.module.css";
import { Footer } from "./components/Footer";
import { useTitles } from "@/lib/useClaimUiState";
import { DebugUiState } from "./components/DebugUiState";
import { WalletMenu } from "./components/WalletMenu";

interface AirdropLayoutProps {
  showTitles?: boolean;
  titleOverwrite?: React.ReactNode;
  subtitleOverwrite?: React.ReactNode;
  children: ReactNode;
}

export const AirdropLayout = ({
  showTitles = true,
  titleOverwrite,
  subtitleOverwrite,
  children,
}: AirdropLayoutProps) => {
  const { title, subtitle } = useTitles();
  return (
    <main className={`${stylesPeaq.main} bg-white !p-0`}>
      <header className="flex w-full items-center justify-between p-4 pb-0">
        <Image
          src="/images/peaq-logo.png"
          alt="Logo"
          width={100}
          height={100}
        />
        <nav>
          <ul className="flex space-x-4">
            <li>Learn</li>
            <li>Build</li>
            <li>Community</li>
          </ul>
        </nav>

        <WalletMenu />
      </header>
      <div className="w-full">
        <div className="p-4 pb-20">
          <div
            className={`${stylesPeaq.bg} flex min-h-screen items-center justify-center p-8`}
          >
            <section className="flex w-full max-w-4xl flex-col gap-2 rounded-lg px-8 py-20 text-center text-white">
              {showTitles && (
                <>
                  <h1 className="text-[52px] font-normal">
                    {titleOverwrite ?? title}
                  </h1>
                  <h2 className="text-base">{subtitleOverwrite ?? subtitle}</h2>
                </>
              )}
              <div className="flex flex-col items-center justify-center gap-4 pt-4">
                {children}
              </div>
              <DebugUiState />
              <a className="opacity-40" href="#">
                Terms and conditions
              </a>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
};
