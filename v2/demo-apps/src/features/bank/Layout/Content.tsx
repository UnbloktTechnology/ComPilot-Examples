import Image from "next/image";
import React from "react";


export const Content = () => {
  const services = [
    "Current accounts",
    "Mortgages",
    "Credit cards",
    "Savings",
    "Loans",
    "International",
    "Investing",
    "Insurance",
  ];

  const contentImgs = [
    "/images/content1.png",
    "/images/content2.png",
    "/images/content3.png",
  ];

  return (
    <div className="py-6">
      <div className="flex flex-wrap gap-8">
        {services.map((service, index) => (
          <h3 key={index} className="text-3xl w-96 cursor-pointer">
            {service} <span className="text-[#DB0011]">&gt;</span>
          </h3>
        ))}
      </div>

      <div className="flex flex-wrap justify-between py-6">
          {contentImgs.map((img, index) => (
            <Image key={index} src={img} width={420} height={235} alt="" className="w-1/3 p-4"/>
          ))}
      </div>
    </div>
  );
};