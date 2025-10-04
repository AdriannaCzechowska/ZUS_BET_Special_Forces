import { Youtube, Linkedin, Rss, ArrowUp } from "lucide-react";
import Link from "next/link";

const XIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
        <title>X</title>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
)

const SocialLink = ({ icon, text, href }: { icon: React.ReactNode, text: string, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:underline">
        <div className="bg-white text-primary rounded-full p-1.5 flex items-center justify-center">
            {icon}
        </div>
        <span>{text}</span>
    </a>
);

const FooterLink = ({ text }: { text: string }) => (
  <li className="flex items-center">
    <span className="text-white/80 mr-2">&gt;</span>
    <span className="hover:underline cursor-pointer">{text}</span>
  </li>
);

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          <div className="w-full md:w-1/3">
            <ul className="space-y-3">
              <FooterLink text="Zamówienia publiczne" />
              <FooterLink text="Praca w ZUS" />
              <FooterLink text="Praca dla lekarzy" />
              <FooterLink text="Konkursy ofert" />
              <FooterLink text="Mienie zbędne" />
              <FooterLink text="Mapa serwisu" />
            </ul>
          </div>

          <div className="w-full md:w-2/3 flex flex-col md:flex-row justify-between gap-8">
             <div className="flex-grow space-y-6">
                <div className="flex items-center gap-6">
                    <span className="hover:underline cursor-pointer">Deklaracja dostępności</span>
                    <span className="text-white/50">|</span>
                    <span className="hover:underline cursor-pointer">Ustawienia plików cookies</span>
                </div>
                 <div className="flex items-center flex-wrap gap-x-6 gap-y-4">
                    <SocialLink href="#" icon={<Youtube className="h-5 w-5" />} text="Elektroniczny ZUS" />
                    <span className="text-white/50 hidden sm:inline">|</span>
                    <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} text="Linkedin" />
                    <span className="text-white/50 hidden sm:inline">|</span>
                    <SocialLink href="#" icon={<XIcon />} text="X" />
                     <span className="text-white/50 hidden sm:inline">|</span>
                    <SocialLink href="#" icon={<Rss className="h-5 w-5" />} text="Kanał RSS" />
                </div>
             </div>
              <div className="flex-shrink-0">
                  <button onClick={scrollToTop} className="flex items-center gap-2 text-white hover:underline">
                      <span>Do góry</span>
                      <div className="h-8 w-8 rounded-full border border-white flex items-center justify-center">
                          <ArrowUp className="h-5 w-5" />
                      </div>
                  </button>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
