// import screenshotDevices from "../images/user-button@2xrl.webp";
// import signIn from "../images/sign-in@2xrl.webp";
// import verify from "../images/verify@2xrl.webp";
// import userButton2 from "../images/user-button-2@2xrl.webp";
// import signUp from "../images/sign-up@2xrl.webp";
// import logo from "../images/logo.png";

import "@/styles/landing.css";
import Image from "next/image";
import Link from "next/link";
import { DisPlanLogo } from "./displan-logo";
import { NextLogo } from "./next-logo";
import { DeployButton } from "./deploy-button";

export function LandingHero() {
  return (
    <main className="bg-background relative">
      <div className="w-full bg-background max-w-[75rem] mx-auto flex flex-col border-l border-r border-[#8888881A] row-span-3">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-background" />
        {/* <Image
          alt="Device"
          className="size-64 bg-transparent absolute left-1/2 -translate-x-[23.75rem] -top-6 h-[51.375rem] object-contain w-[39.0625rem]"
          src={logo}
          unoptimized
        /> */}

        <div className="p-10 border-b border-[#8888881A]">
          <h1 className="text-5xl font-bold tracking-tight text-[#131316] dark:text-white relative">
            Build websites with AI, instantly
          </h1>

          <p className="text-black/70 dark:text-white/70 pt-3 pb-6 max-w-[30rem] text-[1.0625rem] relative">
            DisPlan lets you create complete, responsive websites using natural language and a powerful visual builder — no code, no limits.
          </p>
        </div>
        <div className="flex gap-8 w-full h-[41.25rem] scale-[1.03]">
          <div className="space-y-8 translate-y-12">
            <img
              alt="Device"
              src="https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg"
              className="relative left-[5%] w-[90%] rounded-xl bg-[#8888881A] shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)] ring-1 ring-gray-950/5"
            />
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-[-120px] h-[18.75rem] bg-gradient-to-t from-white dark:from-background" />
    </main>
  );
}