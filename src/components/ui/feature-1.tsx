import { Button } from "@/components/ui/button";
import "@/app/dashboard/apps/website-builder/designer/styles/button.css"
import Link from "next/link";

interface Feature1Props {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  buttonPrimary: {
    label: string;
    href: string;
  };
  buttonSecondary: {
    label: string;
    href: string;
  };
}

export const Feature1 = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "https://shadcnblocks.com/images/block/placeholder-1.svg",
  imageAlt = "placeholder hero",
  buttonPrimary = {
    label: "Get Started",
    href: "/sign-up",
  },
}: Feature1Props) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 mt-0 text-4xl font-semibold text-balance lg:text-5xl text-white">
              {title}
            </h1>
            <p className="mb-8 max-w-xl lg:text-lg text-white/70">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Link href={"/sign-up"}>
              <button className="button_edit_project_r222SDSasdasdw">
                  {buttonPrimary.label}
              </button>
              </Link>
            </div>
          </div>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-[63%] w-[63%] rounded-md object-cover fdgdgfgdrgg"
          />
        </div>
      </div>
    </section>
  );
};
