import Image from "next/image";
import Link from "next/link";
import AppTag from "./AppTag";

export type AppCardProps = {
  url: string;
  name: string;
  description: string;
  image: string;
  poweredBy?: string;
  tags?: { text: string; bgColor: string; textColor: string }[];
};

export default function AppCard(props: AppCardProps) {
  return (
    <Link
      key={props.url}
      href={props.url}
      target="_blank"
      rel={"noopener noreferrer"}
    >
      <div className="relative h-full rounded-lg border border-solid border-[#BFD5FF] p-2">
        <Image
          src={props.image}
          alt={props.name}
          width={150}
          height={250}
          className="w-full"
        />
        {props.poweredBy && (
          <div className="relative">
            <div className="absolute -top-[35px] right-1/2 translate-x-1/2 rounded-full bg-white p-2 text-white">
              <Image
                className=""
                src={props.poweredBy}
                alt={"powered by"}
                width={40}
                height={40}
              />
            </div>
          </div>
        )}
        <div className="mt-6 w-full gap-2 p-2">
          <div className="mb-4 flex items-center gap-1">
            {props.tags?.map((tag) => (
              <AppTag
                text={tag.text}
                bgColor={tag.bgColor}
                textColor={tag.textColor}
                key={tag.text}
              />
            ))}
          </div>
          <h6 className="mb-4 text-xl font-medium">{props.name}</h6>
          <p className="text-sm font-light text-[#667085]">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
