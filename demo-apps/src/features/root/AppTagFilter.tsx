import { type TAG } from "../../pages";
import { type AppCardProps } from "./AppCard";
import AppLegendTag from "./AppLegendTag";

export const AppTagFilter = (props: {
  legendTags: {
    text: string;
    tag: TAG;
  }[];
  projects: AppCardProps[];
  onSelect: (tag: TAG) => void;
  onDeselect: (tag: TAG) => void;
}) => {
  return (
    <>
      <AppLegendTag
        text={"All"}
        totalProjects={props.projects.length}
        tag={"ALL"}
        onSelect={props.onSelect}
        onDeselect={props.onDeselect}
      />
      {props.legendTags.map((tag) => (
        <AppLegendTag
          text={tag.text}
          tag={tag.tag}
          totalProjects={
            props.projects.filter((project) =>
              project.tags?.some((_tag) => _tag.text === tag.tag),
            ).length
          }
          key={tag.tag}
          onSelect={props.onSelect}
          onDeselect={props.onDeselect}
        />
      ))}
    </>
  );
};
