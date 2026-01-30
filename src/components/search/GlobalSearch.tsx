import { useState, useEffect, useCallback, useRef } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Calculator, Building2, BookOpen, TrendingUp } from "lucide-react";
import circulars from "@/data/circulars.json";
import stocks from "@/data/stocks.json";
import definitions from "@/data/definitions.json";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((type: string, id: string) => {
    setOpen(false);
    switch (type) {
      case "circular":
        navigate(`/compliance/${id}`);
        break;
      case "stock":
        navigate(`/stocks/${id}`);
        break;
      case "definition":
        navigate(`/learn/${id}`);
        break;
      case "calculator":
        navigate(`/calculators/${id}`);
        break;
      default:
        break;
    }
  }, [navigate]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm text-muted-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-64 lg:w-80"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search any term, circular, or formula...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search circulars, stocks, formulas..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Regulatory Circulars">
              {circulars.slice(0, 4).map((circular) => (
                <CommandItem
                  key={circular.id}
                  onSelect={() => handleSelect("circular", circular.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{circular.title.slice(0, 50)}...</span>
                    <span className="text-xs text-muted-foreground">{circular.source} • {circular.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Nifty 50 Stocks">
              {stocks.slice(0, 4).map((stock) => (
                <CommandItem
                  key={stock.id}
                  onSelect={() => handleSelect("stock", stock.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.name}</span>
                    <span className="text-xs text-muted-foreground">{stock.sector} • P/E: {stock.pe}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Financial Terms">
              {definitions.slice(0, 4).map((def) => (
                <CommandItem
                  key={def.id}
                  onSelect={() => handleSelect("definition", def.id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{def.term}</span>
                    <span className="text-xs text-muted-foreground">{def.category} • {def.fullName}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Calculators">
              <CommandItem
                onSelect={() => handleSelect("calculator", "sip")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">SIP Calculator</span>
                  <span className="text-xs text-muted-foreground">Calculate systematic investment returns</span>
                </div>
              </CommandItem>
              <CommandItem
                onSelect={() => handleSelect("calculator", "fv")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">Future Value Calculator</span>
                  <span className="text-xs text-muted-foreground">FV = PV × (1 + r)^n</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
