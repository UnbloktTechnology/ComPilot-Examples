import { useState } from "react";
import { type TAG } from "../../pages";

export type AppLegendTagProps = {
  text: string;
  totalProjects: number;
  tag: TAG;
  onSelect: (tag: TAG) => void;
  onDeselect: (tag: TAG) => void;
};

export default function AppLegendTag(props: AppLegendTagProps) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`box-border flex items-center justify-center gap-2 rounded-lg border-[#0258FD] px-3 py-2 text-base hover:cursor-pointer hover:border ${selected ? "bg-[#0258FD] text-white" : "bg-gray-300"}`}
      onClick={() => {
        if (selected) props.onDeselect(props.tag);
        else props.onSelect(props.tag);

        setSelected(!selected);
      }}
    >
      {props.text}

      <div
        className={`h-4 w-4 rounded-full  text-center text-xs ${selected ? `bg-white text-[#011947]` : `bg-gray-400 text-gray-200`}`}
      >
        {props.totalProjects}
      </div>
    </div>
  );
}
