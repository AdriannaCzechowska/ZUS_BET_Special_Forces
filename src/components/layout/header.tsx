import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
        <div className="text-xl sm:text-2xl font-bold font-headline tracking-wide">
          Pension<span className="opacity-80">Vision</span>
        </div>
        <h1 className={cn(
          "text-lg sm:text-xl md:text-2xl font-headline font-semibold",
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        )}>
          Symulator Emerytalny
        </h1>
        <div aria-hidden="true"></div>
      </div>
    </header>
  );
}
