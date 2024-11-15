import React from "react";

interface IIcon {
  icon: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  IconType?: "svg" | "jpeg" | "url";
  onClick?: () => void;
}

export const Icon = ({
  icon,
  size = "auto ",
  width = "auto ",
  height = "auto ",
  color,
  className,
  IconType = "svg",
  onClick,
}: IIcon) => {
  const url = IconType !== "url" ? `/icons/${icon}.${IconType}` : icon;

  return (
    <>
      {color && IconType !== "url" ? (
        <div
          className={className}
          onClick={onClick}
          onKeyUp={onClick}
          style={{
            WebkitMaskImage: `url('${url}')`,
            WebkitAlignItems: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "100%",
            mask: `url('${url}') center center/100% 100% no-repeat`,
            backgroundColor: color,
            width: width !== "auto " ? `${width}px` : `${size}px`,
            height: height !== "auto " ? `${height}px` : `${size}px`,
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${url}`}
          style={{
            width: width !== "auto " ? `${width}px` : `${size}px`,
            height: height !== "auto " ? `${height}px` : `${size}px`,
          }}
          className={className}
          alt={"Icon"}
          onClick={onClick}
          onKeyUp={onClick}
        />
      )}
    </>
  );
};
