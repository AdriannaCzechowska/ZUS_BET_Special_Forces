import { Youtube, Linkedin, Rss, Twitter } from "lucide-react";
import Link from "next/link";

const XIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
        <title>X</title>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
)

const SocialLink = ({ icon, text, href }: { icon: React.ReactNode, text: string, href: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:underline">
        <div className="bg-white text-primary rounded-full p-1.5 flex items-center justify-center">
            {icon}
        </div>
        <span>{text}</span>
    </a>
)

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1">
            <div className="grid grid-cols-2 gap-8">
                <ul className="space-y-3">
                    <li><span className="hover:underline cursor-pointer">&gt; Zamówienia publiczne</span></li>
                    <li><span className="hover:underline cursor-pointer">&gt; Praca w ZUS</span></li>
                    <li><span className="hover:underline cursor-pointer">&gt; Praca dla lekarzy</span></li>
                </ul>
                <ul className="space-y-3">
                    <li><span className="hover:underline cursor-pointer">&gt; Konkursy ofert</span></li>
                    <li><span className="hover:underline cursor-pointer">&gt; Mienie zbędne</span></li>
                    <li><span className="hover:underline cursor-pointer">&gt; Mapa serwisu</span></li>
                </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <span className="block hover:underline cursor-pointer">Deklaracja dostępności</span>
                    <span className="block hover:underline cursor-pointer">Ustawienia plików cookies</span>
                </div>
                 <div className="space-y-4 col-span-2">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SocialLink href="#" icon={<Youtube className="h-5 w-5" />} text="Elektroniczny ZUS" />
                        <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} text="Linkedin" />
                        <SocialLink href="#" icon={<XIcon />} text="X" />
                        <SocialLink href="#" icon={<Rss className="h-5 w-5" />} text="Kanał RSS" />
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}