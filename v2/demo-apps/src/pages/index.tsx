import Head from "next/head";
import AppCard, { type AppCardProps } from "../features/root/AppCard";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../features/bank/Components/Button";
import { AppTagFilter } from "../features/root/AppTagFilter";

const VCV_TAG = {
  text: "VCV",
  bgColor: "#D0F8AB",
  textColor: "#326212",
};

const ZKP_TAG = {
  text: "ZKP",
  bgColor: "#F4DEFF",
  textColor: "#680B97",
};

const OCV_TAG = {
  text: "OCV",
  bgColor: "#DBA3F7",
  textColor: "#680B97",
};

const OFF_TAG = {
  text: "OFF",
  bgColor: "#BFD5FF",
  textColor: "#011947",
};

const EW_TAG = {
  text: "EW",
  bgColor: "#FEDF89",
  textColor: "#93370D",
};

const AS_TAG = {
  text: "AS",
  bgColor: "#FECDCA",
  textColor: "#912018",
};

const LEGEND_TAG = [
  {
    text: "ZKP verification",
    tag: ZKP_TAG,
  },
  {
    text: "VC verification",
    tag: VCV_TAG,
  },
  {
    text: "Off-chain verification",
    tag: OFF_TAG,
  },
  {
    text: "On-chain verification",
    tag: OCV_TAG,
  },
  {
    text: "External wallet",
    tag: EW_TAG,
  },
  {
    text: "Abstracted signer",
    tag: AS_TAG,
  },
] as const;

const PROJECTS: AppCardProps[] = [
  {
    url: "/defi-rule-engine",
    name: "Compliant Dex",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/dex.svg",
    tags: [VCV_TAG, OFF_TAG, EW_TAG],
    version: "v2",
    poweredBy: "/images/poweredBy/uniswap.svg",
  },
  {
    url: "/defi-offchain-zkp",
    name: "Gated Dex",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/dex.svg",
    tags: [ZKP_TAG, OFF_TAG, EW_TAG],
    version: "v2",
    poweredBy: "/images/poweredBy/uniswap.svg",
  },
  {
    url: "/bank",
    name: "Banking",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/banking.svg",
    tags: [VCV_TAG, OFF_TAG, AS_TAG],
    version: "v2",
    poweredBy: "/images/poweredBy/green-bank.svg",
  },
  {
    url: "/bank-kyb",
    name: "Banking KYB",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/banking.svg",
    tags: [VCV_TAG, OFF_TAG, AS_TAG],
    version: "v2",
    poweredBy: "/images/poweredBy/green-bank.svg",
  },
  {
    url: "/bank-web3",
    name: "Web3 Banking",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/banking-web3.svg",
    tags: [VCV_TAG, OFF_TAG, EW_TAG],
    version: "v2",
    poweredBy: "/images/poweredBy/payee.png",
  },
  {
    url: "/gated-nft",
    name: "Gating with Off-chain Signatures",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/gating.svg",
    version: "v2",
  },
  {
    url: "/gated-nft-tezos",
    name: "Gating with Off-chain Signatures - Tezos",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/gating.svg",
    version: "v2",
  },
  {
    url: "/multi-chain-support",
    name: "Multi Chain Support",
    description:
      "Short description for this app example that we showcase here. Better to have a few lines of text, so not very short if possible",
    image: "/images/apps/gating.svg",
    version: "v2",
  },
];

export type TAG = "ALL" | "VCV" | "ZKP" | "OCV" | "OFF" | "EW" | "AS";

export default function Home() {
  const [tags, setTags] = useState<TAG[]>([]);

  return (
    <>
      <Head>
        <title>NexeraID Examples Root Portfolio</title>
        <meta
          name="description"
          content="NexeraID Examples Root Portfolio page"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center self-center bg-[#0258FD]">
        <div className="mb-12 flex w-full justify-center rounded-b-[72px] bg-white">
          <div className="container mb-16">
            <div className="mb-12 mt-8 flex w-full items-center text-center">
              <div className="flex-grow">
                <Image
                  src={"/images/logo/compilot.svg"}
                  alt={"compilot"}
                  height={80}
                  width={250}
                />
              </div>
              <div className="flex gap-4">
                <Button className="rounded-lg border border-solid border-[#D0D5DD] bg-transparent p-2 text-[#00040A]">
                  Request demo
                </Button>
                <Button className="rounded-lg bg-[#0258FD] p-2 text-white">
                  Login
                </Button>
              </div>
            </div>
            <div className="mb-12 mt-8 flex w-full flex-col items-center justify-center gap-4 text-center">
              <h1 className="mb-4 text-6xl font-medium">
                ComPilot.AI Example Applications
              </h1>
              <p className=" w-[580px] text-gray-600">
                These examples demonstrate the ComPilot.AI identity verification
                process working in different circumstances.
              </p>
            </div>
            <div className="mb-8 mt-2 flex flex-wrap justify-center gap-4">
              <AppTagFilter
                legendTags={LEGEND_TAG.map((tag) => ({
                  text: tag.text,
                  tag: tag.tag.text as TAG,
                }))}
                projects={PROJECTS}
                onSelect={(_tag) => {
                  const _tags = new Set([...tags, _tag]);
                  setTags(Array.from(_tags));
                }}
                onDeselect={(_tag) => {
                  const _tags = new Set(tags);
                  _tags.delete(_tag);
                  setTags(Array.from(_tags));
                }}
              />
            </div>
            <div className="flex justify-center">
              <div className="grid gap-8 lg:grid-cols-4">
                {PROJECTS.filter((project) =>
                  tags.includes("ALL") || tags.length === 0
                    ? true
                    : project.tags?.some((_tag) =>
                        tags.includes(_tag.text as TAG),
                      ),
                ).map((project) => (
                  <AppCard
                    url={project.url}
                    image={project.image}
                    poweredBy={project.poweredBy}
                    name={project.name}
                    description={project.description}
                    key={project.name}
                    tags={project.tags}
                    version={project.version}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="container relative flex h-[420px] w-full gap-8 text-center">
          <div className="mr-4 flex h-fit border-r border-solid border-[#3F81FF] pr-8">
            <h2 className="mr-6 text-start text-5xl leading-normal text-white">
              Follow our product <br />
              development exclusively on
            </h2>
            <Image
              className="self-end pb-3"
              src={"/images/logo/linkedin.svg"}
              alt={"linkedin"}
              height={48}
              width={48}
            />
          </div>
          <div className="flex gap-8 text-start text-white [&_h6]:mb-6 [&_h6]:text-sm [&_p]:mb-4 [&_p]:text-[#BFD5FF]">
            <div className="">
              <h6>ABOUT</h6>
              <p>About us</p>
              <p>Contact us</p>
              <p>Academy</p>
            </div>
            <div>
              <h6>FEATURES</h6>
              <p>Case management</p>
              <p>Lifecycle risk management</p>
              <p>Privacy preserving KYC</p>
            </div>
            <div>
              <h6>DEVELOPERS</h6>
              <p>Documentation</p>
              <p>Github</p>
            </div>
          </div>
          <Image
            className="margin-auto absolute bottom-0 w-full"
            src={"/images/logo/compilot-white.svg"}
            alt={"compilot"}
            height={90}
            width={1024}
          />
        </footer>
      </main>
    </>
  );
}
