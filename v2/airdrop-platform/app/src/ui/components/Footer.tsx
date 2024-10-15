import React from "react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer>
      <div className="bg-black py-10 text-white">
        <div className="container mx-auto">
          <h2 className="mb-6 text-xl font-bold">Latest</h2>
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Image
              src="/images/peaq-footer-1.png"
              alt="DePIN Digest"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <Image
              src="/images/peaq-footer-2.png"
              alt="SPIN.FASHION"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <Image
              src="/images/peaq-footer-3.png"
              alt="Certik Skynet"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-10 text-black">
        <div className="container mx-auto flex flex-col items-start justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex flex-col space-y-4">
            <Image
              src="/images/peaq-logo.png"
              alt="Peaq Logo"
              width={100}
              height={100}
            />
            <div className="flex space-x-4">
              <a href="#">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    src="/images/social-X.svg"
                    alt="X"
                    width={24}
                    height={24}
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    src="/images/social-Discord.svg"
                    alt="Discord"
                    width={24}
                    height={24}
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    src="/images/social-Youtube.svg"
                    alt="Youtube"
                    width={24}
                    height={24}
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    src="/images/social-Github.svg"
                    alt="Github"
                    width={24}
                    height={24}
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    src="/images/social-Telegram.svg"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                </div>
              </a>
            </div>
          </div>
          <div className="flex w-full flex-col justify-between space-y-6 md:w-auto md:flex-row md:space-x-16 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-bold">Learn</h3>
              <a href="#" className="text-gray-600 hover:text-black">
                Vision
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Ecosystem
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Token
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Use Cases
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Impact Report
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-bold">Build</h3>
              <a href="#" className="text-gray-600 hover:text-black">
                Build on peaq
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Grant Program
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Documentation
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                SDK
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Modular DePIN Functions
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Test on Krest
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-bold">Community</h3>
              <a href="#" className="text-gray-600 hover:text-black">
                Community Hub
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Ambassador Program
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Blog
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Media Room
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-600">
          <p>© 2024 Peaq Foundation Ltd.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-black">
              Imprint
            </a>
            <a href="#" className="hover:text-black">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
