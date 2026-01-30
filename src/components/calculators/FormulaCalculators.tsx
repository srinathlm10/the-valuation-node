import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Bot, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormulaCalculatorProps {
  onExplain: (formula: string, result: { inputs: Record<string, number>; output: number }) => void;
}

export function FutureValueCalculator({ onExplain }: FormulaCalculatorProps) {
  const [presentValue, setPresentValue] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const futureValue = presentValue * Math.pow(1 + rate / 100, years);
  const totalGain = futureValue - presentValue;
  const multiplier = futureValue / presentValue;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Future Value Calculator</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              FV = PV × (1 + r)^n
            </CardDescription>
          </div>
          <Calculator className="h-8 w-8 opacity-80" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Present Value Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pv" className="text-sm font-medium">
              Present Value (PV)
            </Label>
            <span className="text-sm font-mono text-muted-foreground">
              ₹{presentValue.toLocaleString("en-IN")}
            </span>
          </div>
          <Slider
            id="pv"
            min={10000}
            max={10000000}
            step={10000}
            value={[presentValue]}
            onValueChange={([val]) => setPresentValue(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹10,000</span>
            <span>₹1 Crore</span>
          </div>
        </div>

        {/* Interest Rate Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rate" className="text-sm font-medium">
              Annual Interest Rate (r)
            </Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider
            id="rate"
            min={1}
            max={30}
            step={0.5}
            value={[rate]}
            onValueChange={([val]) => setRate(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Time Period Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="years" className="text-sm font-medium">
              Time Period (n)
            </Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider
            id="years"
            min={1}
            max={40}
            step={1}
            value={[years]}
            onValueChange={([val]) => setYears(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>40 years</span>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Future Value</span>
            <span className="text-xl font-bold font-mono text-primary">
              ₹{Math.round(futureValue).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Gain</span>
            <span className="font-mono text-emerald-600">
              +₹{Math.round(totalGain).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Money Multiplied</span>
            <span className="font-mono">{multiplier.toFixed(2)}x</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() =>
            onExplain("Future Value", {
              inputs: { presentValue, rate, years },
              output: futureValue,
            })
          }
        >
          <Bot className="h-4 w-4" />
          Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function SIPCalculator({ onExplain }: FormulaCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const futureValue =
    monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvested = monthlyInvestment * months;
  const totalGain = futureValue - totalInvested;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">SIP Calculator</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Systematic Investment Plan Returns
            </CardDescription>
          </div>
          <Calculator className="h-8 w-8 opacity-80" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Monthly Investment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Monthly Investment</Label>
            <span className="text-sm font-mono text-muted-foreground">
              ₹{monthlyInvestment.toLocaleString("en-IN")}
            </span>
          </div>
          <Slider
            min={500}
            max={100000}
            step={500}
            value={[monthlyInvestment]}
            onValueChange={([val]) => setMonthlyInvestment(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹500</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Expected Return */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Annual Return</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider
            min={6}
            max={25}
            step={0.5}
            value={[rate]}
            onValueChange={([val]) => setRate(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Time Period */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Investment Duration</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider
            min={1}
            max={30}
            step={1}
            value={[years]}
            onValueChange={([val]) => setYears(val)}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Future Value</span>
            <span className="text-xl font-bold font-mono text-primary">
              ₹{Math.round(futureValue).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Invested</span>
            <span className="font-mono">₹{totalInvested.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Wealth Gained</span>
            <span className="font-mono text-emerald-600">
              +₹{Math.round(totalGain).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() =>
            onExplain("SIP", {
              inputs: { monthlyInvestment, rate, years },
              output: futureValue,
            })
          }
        >
          <Bot className="h-4 w-4" />
          Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}
