export type AppTagProps = {
  text: string;
  bgColor: string;
  textColor: string;
};

export default function AppTag(props: AppTagProps) {
  return (
    <div
      className={`flex h-6 w-10 items-center justify-center rounded-lg px-1 text-xs`}
      style={{ backgroundColor: props.bgColor, color: props.textColor }}
    >
      {props.text}
    </div>
  );
}
