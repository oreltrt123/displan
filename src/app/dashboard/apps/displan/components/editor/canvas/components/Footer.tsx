import Image from 'next/image';
import InstaIcon from '../../../../../../../../../public/assets/icons/insta.svg';
import XIcon from '../../../../../../../../../public/assets/icons/x-social.svg';
import LinkedInIcon from '../../../../../../../../../public/assets/icons/linkedin.svg';
import YoutubeIcon from '../../../../../../../../../public/assets/icons/youtube.svg';

export const Footer = () => {
  return (
    <footer className='py-5 bg-black text-white/60 border-t border-white/20'>
      <div className="container">
        <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
          <div className="text-center">2024 Eldora UI All rights are reserved</div>
          <ul className='flex justify-center gap-2.5'>
            <li><Image src={XIcon} alt="X social" width={24} height={24} /></li>
            <li><Image src={LinkedInIcon} alt="LinkedIn" width={24} height={24} /></li>
            <li><Image src={InstaIcon} alt="Instagram" width={24} height={24} /></li>
            <li><Image src={YoutubeIcon} alt="YouTube" width={24} height={24} /></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
