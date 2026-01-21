"use client";
import Intercom from "@intercom/messenger-js-sdk";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    Intercom({
      app_id: "ts43f4k1",
    });
  }, []);

  return (
    <div
      className={
        "min-h-screen flex bg-[#000000]"
      }
    >
      <div className="fixed top-0 left-0 bg-[url('/assets/bg.webp')] bg-contain bg-center bg-no-repeat w-full h-full opacity-50"></div>
      <div className="backdrop-blur-[2px] w-full h-screen relative z-10">
        <div className="w-full h-full flex flex-col justify-between">
          <div className="my-auto">
            <div className="w-full items-center justify-center flex">
              <img
                src="https://framerusercontent.com/images/jsPyKWn60OKS9FxqTFddWtlsJBg.png?width=249&height=102"
                alt="logo"
                className="mx-auto h-10"
              />
            </div>
            {children}
          </div>
          <div className="mb-10 text-2xl text-center text-white">
            send . smart . campaigns{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
