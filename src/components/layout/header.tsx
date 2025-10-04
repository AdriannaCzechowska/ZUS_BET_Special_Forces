import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
        <h1 className={cn(
          "text-xl sm:text-2xl font-headline font-semibold"
        )}>
          Symulator Emerytalny
        </h1>
        <div aria-hidden="true"></div>
      </div>
    </header>
  );
}
