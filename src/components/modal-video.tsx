"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";

// Use a direct URL string for images inside /public
const SecondaryIllustration = "/images/secondary-illustration.svg";

interface ModalVideoProps {
  thumb: StaticImageData | string;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
}: ModalVideoProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      {/* Thumbnail Button */}
<div className="w-full max-w-5xl aspect-[16/9] overflow-hidden rounded-2xl bg-black shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0" 
style={{ outline: "none", position: "relative", left: "30px"}}>

            <iframe
              src="https://player.vimeo.com/video/1095304075?h=5995383739"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl"
              style={{ outline: "none"}}
            />
</div>
    </div>
  );
}

// "use client";

// import { useState, useRef } from "react";
// import type { StaticImageData } from "next/image";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import Image from "next/image";

// // Use a direct URL string for images inside /public
// const SecondaryIllustration = "/images/secondary-illustration.svg";

// interface ModalVideoProps {
//   thumb: StaticImageData | string;
//   thumbWidth: number;
//   thumbHeight: number;
//   thumbAlt: string;
//   video: string;
//   videoWidth: number;
//   videoHeight: number;
// }


// export default function ModalVideo({
//   thumb,
//   thumbWidth,
//   thumbHeight,
//   thumbAlt,
//   video,
//   videoWidth,
//   videoHeight,
// }: ModalVideoProps) {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   return (
//     <div className="relative">
//       {/* Secondary illustration */}
//       <div
//         className="pointer-events-none absolute bottom-8 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2"
//         aria-hidden="true"
//       >
//         <Image
//           className="md:max-w-none"
//           src={SecondaryIllustration}
//           width={1165}
//           height={1012}
//           alt="Secondary illustration"
//         />
//       </div>

//       {/* Video thumbnail */}
//       <button
//         className="group relative flex items-center justify-center rounded-2xl focus:outline-hidden focus-visible:ring-3 focus-visible:ring-indigo-200"
//         onClick={() => {
//           setModalOpen(true);
//         }}
//         aria-label="Watch the video"
//         data-aos="fade-up"
//         data-aos-delay={200}
//       >
//         <figure className="relative overflow-hidden rounded-2xl before:absolute before:inset-0 before:-z-10 before:bg-linear-to-br before:from-gray-900 before:via-indigo-500/20 before:to-gray-900">
//           <Image
//             className="opacity-50 grayscale"
//             src={thumb}
//             width={thumbWidth}
//             height={thumbHeight}
//             priority
//             alt={thumbAlt}
//           />
//         </figure>
//         {/* Play icon */}
//         <span className="pointer-events-none absolute p-2.5 before:absolute before:inset-0 before:rounded-full before:bg-[#88888894] before:duration-300 group-hover:before:scale-110">
//           <span className="relative flex items-center gap-3">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width={20}
//               height={20}
//               fill="none"
//             >
//               <path
//                 fill="url(#pla)"
//                 fillRule="evenodd"
//                 d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm3.5-10-5-3.5v7l5-3.5Z"
//                 clipRule="evenodd"
//               />
//               <defs>
//                 <linearGradient
//                   id="pla"
//                   x1={10}
//                   x2={10}
//                   y1={0}
//                   y2={20}
//                   gradientUnits="userSpaceOnUse"
//                 >
//                   <stop stopColor="#0099FF" />
//                   <stop offset={1} stopColor="#0099FF" stopOpacity=".72" />
//                 </linearGradient>
//               </defs>
//             </svg>
//             <span className="text-sm font-medium leading-tight text-gray-300">
//               Watch Demo
//               <span className="text-gray-600"> - </span>
//               2:14
//             </span>
//           </span>
//         </span>
//       </button>
//       {/* End: Video thumbnail */}

//       <Dialog
//         initialFocus={videoRef}
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//       >
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 z-99999 bg-black/70 transition-opacity duration-300 ease-out data-closed:opacity-0"
//         />
//         <div className="fixed inset-0 z-99999 flex px-4 py-6 sm:px-6">
//           <div className="mx-auto flex h-full max-w-6xl items-center">
//             <DialogPanel
//               transition
//               className="aspect-video max-h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0"
//             >
//             <video
//               ref={videoRef}
//               src="/welcome_to_displan .mp4"
//               controls
//               autoPlay
//               className="w-full h-full object-cover"
//               style={{ outline: "none" }}
//             >
//                 <source src={video} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </DialogPanel>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// }