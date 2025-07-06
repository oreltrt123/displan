import ModalVideo from "./modal-video";
import "@/styles/footer.css"
import VideoPlayer from "@/components/video-player"

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px- afasfawffwf">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Projects start here with DisPlan
            </h1>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="/sign-in"
                  >
                    <span className="relative inline-flex items-center text-black/70 dark:text-white/50">
                      Start Building
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <a
                    className="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
                    href="#0"
                  >
                    Schedule Demo
                  </a>
                </div>
            </div>
          </div>
          <VideoPlayer src="/welcome_to_displan .mp4"  poster="/displan_light_banner.png"/>
        {/* <div className="absolute left-0 right-0 bottom-0 h-[18.75rem] bg-gradient-to-t from-whexport const CARDS = [
  {
    title: "AI Website Builder",
    description:
      "Create fully functional websites using natural language. DisPlan’s AI instantly transforms your ideas into real web apps.",
    href: "/builder",
    linkText: "Start Building",
  },
  {
    title: "Visual Canvas Editor",
    description:
      "Drag and drop components, customize your layout, and build without writing code — all in a powerful visual interface.",
    href: "/editor",
    linkText: "Launch Editor",
  },
  {
    title: "Responsive Design Templates",
    description:
      "Kickstart your project with modern templates built for startups, portfolios, and full-stack apps.",
    href: "/templates",
    linkText: "Browse Templates",
  },
];
ite dark:from-background" /> */}
        </div>
      </div>
    </section>
  );
}

// import ModalVideo from "./modal-video";
// import "@/styles/footer.css"

// export default function HeroHome() {
//   return (
//     <section>
//       <div className="mx-auto max-w-6xl px-4 sm:px- afasfawffwf">
//         {/* Hero content */}
//         <div className="py-12 md:py-20">
//           {/* Section header */}
//           <div className="pb-12 text-center md:pb-20">
//             <h1
//               className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
//               data-aos="fade-up"
//             >
//               Projects start here with DisPlan
//             </h1>
//               <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
//                 <div data-aos="fade-up" data-aos-delay={400}>
//                   <a
//                     className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
//                     href="/sign-in"
//                   >
//                     <span className="relative inline-flex items-center text-black/70 dark:text-white/50">
//                       Start Building
//                       <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
//                         -&gt;
//                       </span>
//                     </span>
//                   </a>
//                 </div>
//                 <div data-aos="fade-up" data-aos-delay={600}>
//                   <a
//                     className="btn relative w-full bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
//                     href="#0"
//                   >
//                     Schedule Demo
//                   </a>
//                 </div>
//             </div>
//           </div>

//           <ModalVideo
//             thumb="/displan_light_banner.png"  // Use public path here
//             thumbWidth={1104}
//             thumbHeight={576}
//             thumbAlt="Modal video thumbnail"
//             video="videos/video.mp4"
//             videoWidth={1920}
//             videoHeight={1080}
//           />
//         <div className="absolute left-0 right-0 bottom-0 h-[18.75rem] bg-gradient-to-t from-white dark:from-background" />
//         </div>
//       </div>
//     </section>
//   );
// }
