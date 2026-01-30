import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, ArrowUpDown, Search, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
  id: string;
  name: string;
  sector: string;
  marketCap: number;
  pe: number;
  pb: number;
  roe: number;
  debtToEquity: number;
  dividendYield: number;
  eps: number;
  revenueGrowth5Y: number;
  profitGrowth5Y: number;
  currentPrice: number;
  weekHigh52: number;
  weekLow52: number;
}

interface StockScreenerProps {
  stocks: Stock[];
  onBotAnalysis: (stock: Stock) => void;
  onViewProfile: (stock: Stock) => void;
}

type SortKey = keyof Pick<Stock, "name" | "marketCap" | "pe" | "roe" | "debtToEquity" | "dividendYield">;

export function StockScreener({ stocks, onBotAnalysis, onViewProfile }: StockScreenerProps) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sectors = useMemo(() => {
    const unique = new Set(stocks.map((s) => s.sector));
    return Array.from(unique).sort();
  }, [stocks]);

  const filteredAndSortedStocks = useMemo(() => {
    let result = stocks.filter((stock) => {
      const matchesSearch =
        stock.name.toLowerCase().includes(search.toLowerCase()) ||
        stock.id.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [stocks, search, sectorFilter, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const formatMarketCap = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L Cr`;
    return `₹${value.toLocaleString("en-IN")} Cr`;
  };

  const SortButton = ({ columnKey, children }: { columnKey: SortKey; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(columnKey)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="data-table-header">
              <TableHead className="w-[250px]">
                <SortButton columnKey="name">Company</SortButton>
              </TableHead>
              <TableHead>Sector</TableHead>
              <TableHead className="text-right">
                <SortButton columnKey="marketCap">Market Cap</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton columnKey="pe">P/E</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton columnKey="roe">ROE %</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton columnKey="debtToEquity">D/E</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton columnKey="dividendYield">Div Yield</SortButton>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStocks.map((stock) => (
              <TableRow
                key={stock.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewProfile(stock)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.id}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {stock.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {stock.sector}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatMarketCap(stock.marketCap)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {stock.pe.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-mono text-sm",
                      stock.roe >= 15 ? "text-emerald-600" : stock.roe < 10 ? "text-rose-600" : ""
                    )}
                  >
                    {stock.roe >= 15 && <TrendingUp className="h-3 w-3" />}
                    {stock.roe < 10 && <TrendingDown className="h-3 w-3" />}
                    {stock.roe.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span className={cn(stock.debtToEquity > 1 ? "text-amber-600" : "")}>
                    {stock.debtToEquity.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {stock.dividendYield.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBotAnalysis(stock);
                    }}
                  >
                    <Bot className="h-3 w-3" />
                    Analyze
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Showing {filteredAndSortedStocks.length} of {stocks.length} companies • Data is static (10-year historical)
      </div>
    </div>
  );
}
