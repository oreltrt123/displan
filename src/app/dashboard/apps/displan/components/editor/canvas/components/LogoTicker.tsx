import acmeLogo from "../../../../../../../../../public/assets/images/acme.png";
import quantumLogo from "../../../../../../../../../public/assets/images/quantum.png";
import echoLogo from "../../../../../../../../../public/assets/images/echo.png";
import celestialLogo from "../../../../../../../../../public/assets/images/celestial.png";
import pulseLogo from "../../../../../../../../../public/assets/images/pulse.png";
import apexLogo from "../../../../../../../../../public/assets/images/apex.png";
import Image from 'next/image';
import LogoCarousel from "./companylogos";

const images = [
  { src: acmeLogo, alt: "Acme Logo" },
  { src: quantumLogo, alt: "Quantum Logo" },
  { src: echoLogo, alt: "Echo Logo" },
  { src: celestialLogo, alt: "Celestial Logo" },
  { src: pulseLogo, alt: "Pulse Logo" },
  { src: apexLogo, alt: "Apex Logo" },
];

export const LogoTicker = () => {
  return(
    <div className="bg-black text-white py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-lg text-center text-white/70 mb-16">Trusted by world&apos;s most innovative teams</h2>
        <LogoCarousel/>
        
        
      </div>

    </div>
  )
};