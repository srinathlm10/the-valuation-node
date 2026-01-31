import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Bot, Calculator } from "lucide-react";

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
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">Future Value Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">FV = PV × (1 + r)^n</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Present Value (PV)</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{presentValue.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[presentValue]} onValueChange={([val]) => setPresentValue(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹10,000</span><span>₹1 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate (r)</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={1} max={30} step={0.5} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>30%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period (n)</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={40} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>40 years</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Future Value</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(futureValue).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Gain</span>
            <span className="font-mono text-emerald">+₹{Math.round(totalGain).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Money Multiplied</span>
            <span className="font-mono">{multiplier.toFixed(2)}x</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("Future Value", { inputs: { presentValue, rate, years }, output: futureValue })}>
          <Bot className="h-4 w-4" />Explain the Math
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
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvested = monthlyInvestment * months;
  const totalGain = futureValue - totalInvested;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">SIP Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">Systematic Investment Plan Returns</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Monthly Investment</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{monthlyInvestment.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={500} max={100000} step={500} value={[monthlyInvestment]} onValueChange={([val]) => setMonthlyInvestment(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹500</span><span>₹1,00,000</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Annual Return</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={6} max={25} step={0.5} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Investment Duration</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={30} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>30 years</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Future Value</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(futureValue).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Invested</span>
            <span className="font-mono">₹{totalInvested.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Wealth Gained</span>
            <span className="font-mono text-emerald">+₹{Math.round(totalGain).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("SIP", { inputs: { monthlyInvestment, rate, years }, output: futureValue })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function CAGRCalculator({ onExplain }: FormulaCalculatorProps) {
  const [beginningValue, setBeginningValue] = useState(100000);
  const [endingValue, setEndingValue] = useState(250000);
  const [years, setYears] = useState(5);

  const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
  const absoluteReturn = ((endingValue - beginningValue) / beginningValue) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">CAGR Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">Compound Annual Growth Rate</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Beginning Value</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{beginningValue.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[beginningValue]} onValueChange={([val]) => setBeginningValue(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Ending Value</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{endingValue.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={10000} max={50000000} step={10000} value={[endingValue]} onValueChange={([val]) => setEndingValue(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={30} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">CAGR</span>
            <span className="text-xl font-bold font-mono text-emerald">{cagr.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Absolute Return</span>
            <span className="font-mono text-emerald">+{absoluteReturn.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Multiplier</span>
            <span className="font-mono">{(endingValue / beginningValue).toFixed(2)}x</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("CAGR", { inputs: { beginningValue, endingValue, years }, output: cagr })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function EMICalculator({ onExplain }: FormulaCalculatorProps) {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">EMI Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">Equated Monthly Installment</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Loan Amount</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{principal.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={100000} max={50000000} step={100000} value={[principal]} onValueChange={([val]) => setPrincipal(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 Lakh</span><span>₹5 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Interest Rate</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={5} max={20} step={0.25} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>5%</span><span>20%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Loan Tenure</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={30} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>30 years</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly EMI</span>
            <span className="text-xl font-bold font-mono text-foreground">₹{Math.round(emi).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-mono text-rose">₹{Math.round(totalInterest).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Payment</span>
            <span className="font-mono">₹{Math.round(totalPayment).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("EMI", { inputs: { principal, rate, years }, output: emi })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function PresentValueCalculator({ onExplain }: FormulaCalculatorProps) {
  const [futureValue, setFutureValue] = useState(10000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const presentValue = futureValue / Math.pow(1 + rate / 100, years);
  const discount = futureValue - presentValue;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">Present Value Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">PV = FV / (1 + r)^n</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Future Value (Goal)</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{futureValue.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={100000} max={100000000} step={100000} value={[futureValue]} onValueChange={([val]) => setFutureValue(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 Lakh</span><span>₹10 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Return Rate</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={1} max={25} step={0.5} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Horizon</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={40} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Invest Today</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(presentValue).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expected Growth</span>
            <span className="font-mono text-emerald">+₹{Math.round(discount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Growth Multiplier</span>
            <span className="font-mono">{(futureValue / presentValue).toFixed(2)}x</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("Present Value", { inputs: { futureValue, rate, years }, output: presentValue })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function CompoundInterestCalculator({ onExplain }: FormulaCalculatorProps) {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12); // Monthly

  const amount = principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
  const interest = amount - principal;
  const simpleInterest = principal * (rate / 100) * years;
  const compoundingBenefit = interest - simpleInterest;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">Compound Interest</CardTitle>
            <CardDescription className="text-hero-subtext">A = P(1 + r/n)^(nt)</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Principal Amount</Label>
            <span className="text-sm font-mono text-muted-foreground">₹{principal.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[principal]} onValueChange={([val]) => setPrincipal(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={1} max={20} step={0.25} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period</Label>
            <span className="text-sm font-mono text-muted-foreground">{years} years</span>
          </div>
          <Slider min={1} max={30} step={1} value={[years]} onValueChange={([val]) => setYears(val)} className="py-2" />
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Final Amount</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(amount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Interest Earned</span>
            <span className="font-mono text-emerald">+₹{Math.round(interest).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">vs Simple Interest</span>
            <span className="font-mono text-amber">+₹{Math.round(compoundingBenefit).toLocaleString("en-IN")} extra</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("Compound Interest", { inputs: { principal, rate, years, frequency }, output: amount })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function RuleOf72Calculator({ onExplain }: FormulaCalculatorProps) {
  const [rate, setRate] = useState(12);

  const yearsToDouble = 72 / rate;
  const exactYears = Math.log(2) / Math.log(1 + rate / 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">Rule of 72</CardTitle>
            <CardDescription className="text-hero-subtext">Time to Double = 72 / Rate</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate</Label>
            <span className="text-sm font-mono text-muted-foreground">{rate}%</span>
          </div>
          <Slider min={1} max={25} step={0.5} value={[rate]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>25%</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time to Double (Rule of 72)</span>
            <span className="text-xl font-bold font-mono text-emerald">{yearsToDouble.toFixed(1)} years</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Exact Calculation</span>
            <span className="font-mono">{exactYears.toFixed(2)} years</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Approximation Error</span>
            <span className="font-mono">{Math.abs(yearsToDouble - exactYears).toFixed(2)} years</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("Rule of 72", { inputs: { rate }, output: yearsToDouble })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}

export function InflationAdjustedReturnCalculator({ onExplain }: FormulaCalculatorProps) {
  const [nominalReturn, setNominalReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const realReturn = ((1 + nominalReturn / 100) / (1 + inflation / 100) - 1) * 100;
  const simpleApprox = nominalReturn - inflation;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-hero-heading">Real Return Calculator</CardTitle>
            <CardDescription className="text-hero-subtext">Inflation-Adjusted Return</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-hero-subtext" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Nominal Return</Label>
            <span className="text-sm font-mono text-muted-foreground">{nominalReturn}%</span>
          </div>
          <Slider min={1} max={30} step={0.5} value={[nominalReturn]} onValueChange={([val]) => setNominalReturn(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Inflation Rate</Label>
            <span className="text-sm font-mono text-muted-foreground">{inflation}%</span>
          </div>
          <Slider min={0} max={15} step={0.5} value={[inflation]} onValueChange={([val]) => setInflation(val)} className="py-2" />
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Real Return</span>
            <span className={`text-xl font-bold font-mono ${realReturn >= 0 ? 'text-emerald' : 'text-rose'}`}>{realReturn.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Simple Approximation</span>
            <span className="font-mono">{simpleApprox.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Purchasing Power</span>
            <span className="font-mono">{realReturn >= 0 ? 'Growing' : 'Shrinking'}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2" onClick={() => onExplain("Real Return", { inputs: { nominalReturn, inflation }, output: realReturn })}>
          <Bot className="h-4 w-4" />Explain the Math
        </Button>
      </CardContent>
    </Card>
  );
}
