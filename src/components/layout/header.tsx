import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";

const ZusLogo = () => (
    <svg width="80" height="40" viewBox="0 0 105 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
        <path d="M0.388,41.011c0,0,16.896-4.992,23.364-21.785C25.228,14.733,21.06,1.294,36.42,0.183c0,0-15.012,3.328-15.792,15.823   c-0.78,12.495,1.56,17.291-3.516,22.955C12.244,44.627,0.388,41.011,0.388,41.011z" fill="#008033"/>
        <path d="M30.42,51.817c0,0,1.956-18.799-13.26-27.471C2.1,15.676-4.684,5.438,9.756,0.575c0,0,0.78,16.444,14.04,22.178   c13.26,5.733,10.548,22.955,10.548,22.955L30.42,51.817z" fill="#008033"/>
        <path d="M54.216,41.011c0,0-16.896-4.992-23.364-21.785C29.376,14.733,33.54,1.294,18.18,0.183c0,0,15.012,3.328,15.792,15.823   c0.78,12.495-1.56,17.291,3.516,22.955C42.356,44.627,54.216,41.011,54.216,41.011z" fill="#008033"/>
    </svg>
);

const HearingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
        <path d="M14.5 10.5c.3-1 .5-2.2.5-3.5a6 6 0 1 0-12 0c0 1.3.2 2.5.5 3.5"/><path d="M10 10c0 1.9.8 3.6 2 4.8"/><path d="M16 16a3 3 0 0 0-3-3"/><path d="M19 13a7 7 0 0 1-7 7"/>
    </svg>
)

const WheelchairIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
        <circle cx="12" cy="4" r="1.5"/><path d="m19 17-5.3 2.3c-1.2.5-2.5 0-3.2-1.2l-3-5.2c-.6-1-2-1.4-3.1-.8l-1.9.9"/><path d="M7 11.5 9.5 9"/><path d="m14.5 11.5 2 2"/><circle cx="6.5" cy="18.5" r="2.5"/><path d="M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    </svg>
)

const BipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 95.68 47.84">
        <path fill="#e30613" d="M0 0h95.68v47.84H0z"/>
        <path fill="#fff" d="M12.93 11.1h9.91v25.64h-9.91zM28.63 11.1h9.91v7h-9.91zM28.63 29.74h9.91v7h-9.91zM48.24 11.1h10.97c7.15 0 10.51 3.52 10.51 8.52 0 4.19-2.09 6.84-5.32 7.74v.13c3.8 1.05 6.37 3.8 6.37 8.52 0 5.4-4.06 9.4-11.45 9.4H48.24zm9.98 12.3c3.28 0 5.05-1.96 5.05-4.58 0-2.8-1.9-4.52-5.18-4.52h-4.8v9.1zm.4 13.34c3.8 0 6.04-2.16 6.04-5.18 0-3.15-2.22-5.12-6.17-5.12h-5.05v10.3zM78.69 11.1h9.91v25.64h-9.91z"/>
    </svg>
)

const EUFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24">
        <rect width="36" height="24" fill="#003399"/>
        <g fill="#ffcc00">
            <path d="M27,12.95l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M22.5,16.79l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M13.5,16.79l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M9,12.95l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M13.5,5.21l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M22.5,5.21l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M18,3.05l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M18,20.95l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M25.12,7.21l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M25.12,14.79l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M10.88,14.79l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
            <path d="M10.88,7.21l0.31,0.95h0.99l-0.8,0.59l0.31,0.95l-0.8,-0.59l-0.8,0.59l0.31,-0.95l-0.8,-0.59h0.99z"/>
        </g>
    </svg>
)

export function Header() {
  return (
    <header className="bg-white text-black sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <ZusLogo />
                <div className="border-l pl-4">
                    <h1 className="text-sm font-semibold text-primary tracking-wider leading-tight">ZAKŁAD<br />UBEZPIECZEŃ<br />SPOŁECZNYCH</h1>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
                <a href="#" className="hover:underline">Kontakt</a>
                <div className="flex items-center gap-1">
                    <span>PL</span>
                    <ChevronDown className="h-4 w-4"/>
                </div>
                <div className="flex items-center border-l pl-4 gap-2">
                    <button className="bg-primary p-1.5 rounded-sm"><HearingIcon /></button>
                    <button className="bg-primary p-1.5 rounded-sm"><WheelchairIcon /></button>
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
