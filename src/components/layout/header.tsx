'use client'
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import Image from 'next/image';

const ZusLogo = () => (
    <Image src="/logo_zus_darker_with_text.svg" alt="Zakład Ubezpieczeń Społecznych" width={180} height={40} className="h-12 w-auto" />
);

const HearingIcon = () => (
    <img src="/gluchy.png" alt="Hearing" className="h-10 w-10 object-contain"/>
)

const WheelchairIcon = () => (
    <img src="/amadeusz.png" alt="Wheelchair" className="h-10 w-10 object-contain"/>
)

const BipIcon = () => (
    <img src="/bip.png" alt="BIP" className="h-10 w-15 object-contain"/>
)

const EUFlagIcon = () => (
    <img src="/unia.png" alt="EU" className="h-10 w-15 object-contain"/>
)

export function Header() {
  return (
    <header className="bg-white text-black sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <ZusLogo />
            </div>

            <div className="flex items-center gap-4 text-sm">
                <a href="#" className="hover:underline">Kontakt</a>
                <div className="flex items-center gap-1">
                    <span>PL</span>
                    <ChevronDown className="h-4 w-4"/>
                </div>
                <div className="flex items-center border-l pl-4 gap-2">
                    <button className="p-1.5 rounded-sm"><HearingIcon /></button>
                    <button className="p-1.5 rounded-sm"><WheelchairIcon /></button>
                    <a href="#"><BipIcon /></a>
                </div>
                <div className="flex items-center gap-2 border-l pl-4">
                    <a href="#" className="border border-gray-400 rounded-sm px-3 py-1.5 hover:bg-gray-100">Zarejestruj w PUE/eZUS</a>
                    <a href="#" className="bg-accent text-black font-bold border border-accent rounded-sm px-3 py-1.5 hover:bg-accent/90">Zaloguj do PUE/eZUS</a>
                </div>
                <div className="flex items-center gap-4 border-l pl-4">
                    <a href="#" className="flex flex-col items-center text-primary">
                        <div className="h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center">
                            <Search className="h-5 w-5"/>
                        </div>
                        <span className="text-xs">Szukaj</span>
                    </a>
                     <a href="#" className="flex flex-col items-center text-primary">
                        <EUFlagIcon />
                        <span className="text-xs text-center">Unia Europejska</span>
                    </a>
                </div>
            </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
            <nav className="flex items-center gap-8 text-sm font-semibold">
                <a href="#" className="text-primary border-b-4 border-primary py-3">Świadczenia</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">Firmy</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">Pracujący</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">Lekarze</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">Wzory formularzy</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">Baza wiedzy</a>
                <a href="#" className="text-primary/80 hover:text-primary py-3">O ZUS</a>
            </nav>
        </div>
      </div>
    </header>
  );
}

    

