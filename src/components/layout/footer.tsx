import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="py-6 mt-8 border-t bg-background">
      <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <Button asChild variant="link" className="text-muted-foreground hover:text-primary">
          <Link href="https://www.zus.pl/o-zus/o-nas/deklaracja-dostepnosci" target="_blank" rel="noopener noreferrer">
            Dostępność WCAG
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6 bg-border hidden sm:block" />
        <Button variant="link" className="text-muted-foreground hover:text-primary">
          Regulamin
        </Button>
      </div>
    </footer>
  );
}
