import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

function NumericInput({
  value,
  onChange,
  min,
  sliderMax,
  prefix,
  suffix,
  step = "any",
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  sliderMax: number;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  return (
    <div className="flex items-center gap-0.5 border rounded-md px-2 py-0.5 bg-background focus-within:ring-1 focus-within:ring-ring">
      {prefix && <span className="text-xs text-muted-foreground select-none">{prefix}</span>}
      <input
        type="number"
        step={step}
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          const n = parseFloat(e.target.value);
          if (!isNaN(n) && n >= 0) onChange(n);
        }}
        onBlur={() => {
          const n = parseFloat(raw);
          const clamped = isNaN(n) ? value : Math.max(min, n);
          onChange(clamped);
          setRaw(String(clamped));
        }}
        className="w-[88px] text-sm font-mono text-right bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="text-xs text-muted-foreground select-none">{suffix}</span>}
    </div>
  );
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function FutureValueCalculator() {
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
            <CardTitle className="text-lg text-slate-50">Future Value Calculator</CardTitle>
            <CardDescription className="text-slate-300">FV = PV × (1 + r)^n</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Present Value (PV)</Label>
            <NumericInput value={presentValue} onChange={setPresentValue} min={0} sliderMax={10000000} prefix="₹" step="1000" />
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[clamp(presentValue, 10000, 10000000)]} onValueChange={([val]) => setPresentValue(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹10,000</span><span>₹1 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate (r)</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={30} suffix="%" />
          </div>
          <Slider min={1} max={30} step={0.5} value={[clamp(rate, 1, 30)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1%</span><span>30%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period (n)</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={40} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={40} step={1} value={[clamp(years, 1, 40)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function SIPCalculator() {
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
            <CardTitle className="text-lg text-slate-50">SIP Calculator</CardTitle>
            <CardDescription className="text-slate-300">Systematic Investment Plan Returns</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Monthly Investment</Label>
            <NumericInput value={monthlyInvestment} onChange={setMonthlyInvestment} min={0} sliderMax={100000} prefix="₹" step="500" />
          </div>
          <Slider min={500} max={100000} step={500} value={[clamp(monthlyInvestment, 500, 100000)]} onValueChange={([val]) => setMonthlyInvestment(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹500</span><span>₹1,00,000</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Annual Return</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={6} max={25} step={0.5} value={[clamp(rate, 6, 25)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Investment Duration</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function CAGRCalculator() {
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
            <CardTitle className="text-lg text-slate-50">CAGR Calculator</CardTitle>
            <CardDescription className="text-slate-300">Compound Annual Growth Rate</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Beginning Value</Label>
            <NumericInput value={beginningValue} onChange={setBeginningValue} min={0} sliderMax={10000000} prefix="₹" step="1000" />
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[clamp(beginningValue, 10000, 10000000)]} onValueChange={([val]) => setBeginningValue(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Ending Value</Label>
            <NumericInput value={endingValue} onChange={setEndingValue} min={0} sliderMax={50000000} prefix="₹" step="1000" />
          </div>
          <Slider min={10000} max={50000000} step={10000} value={[clamp(endingValue, 10000, 50000000)]} onValueChange={([val]) => setEndingValue(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function EMICalculator() {
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
            <CardTitle className="text-lg text-slate-50">EMI Calculator</CardTitle>
            <CardDescription className="text-slate-300">Equated Monthly Installment</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Loan Amount</Label>
            <NumericInput value={principal} onChange={setPrincipal} min={0} sliderMax={50000000} prefix="₹" step="100000" />
          </div>
          <Slider min={100000} max={50000000} step={100000} value={[clamp(principal, 100000, 50000000)]} onValueChange={([val]) => setPrincipal(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 Lakh</span><span>₹5 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Interest Rate</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={20} suffix="%" />
          </div>
          <Slider min={5} max={20} step={0.25} value={[clamp(rate, 5, 20)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>5%</span><span>20%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Loan Tenure</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function PresentValueCalculator() {
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
            <CardTitle className="text-lg text-slate-50">Present Value Calculator</CardTitle>
            <CardDescription className="text-slate-300">PV = FV / (1 + r)^n</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Future Value (Goal)</Label>
            <NumericInput value={futureValue} onChange={setFutureValue} min={0} sliderMax={100000000} prefix="₹" step="100000" />
          </div>
          <Slider min={100000} max={100000000} step={100000} value={[clamp(futureValue, 100000, 100000000)]} onValueChange={([val]) => setFutureValue(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 Lakh</span><span>₹10 Crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Return Rate</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={1} max={25} step={0.5} value={[clamp(rate, 1, 25)]} onValueChange={([val]) => setRate(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Horizon</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={40} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={40} step={1} value={[clamp(years, 1, 40)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12);

  const amount = principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
  const interest = amount - principal;
  const simpleInterest = principal * (rate / 100) * years;
  const compoundingBenefit = interest - simpleInterest;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Compound Interest</CardTitle>
            <CardDescription className="text-slate-300">A = P(1 + r/n)^(nt)</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Principal Amount</Label>
            <NumericInput value={principal} onChange={setPrincipal} min={0} sliderMax={10000000} prefix="₹" step="10000" />
          </div>
          <Slider min={10000} max={10000000} step={10000} value={[clamp(principal, 10000, 10000000)]} onValueChange={([val]) => setPrincipal(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={20} suffix="%" />
          </div>
          <Slider min={1} max={20} step={0.25} value={[clamp(rate, 1, 20)]} onValueChange={([val]) => setRate(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time Period</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function RuleOf72Calculator() {
  const [rate, setRate] = useState(12);

  const yearsToDouble = 72 / rate;
  const exactYears = Math.log(2) / Math.log(1 + rate / 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Rule of 72</CardTitle>
            <CardDescription className="text-slate-300">Time to Double = 72 / Rate</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Interest Rate</Label>
            <NumericInput value={rate} onChange={setRate} min={0.1} sliderMax={25} suffix="%" />
          </div>
          <Slider min={1} max={25} step={0.5} value={[clamp(rate, 1, 25)]} onValueChange={([val]) => setRate(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function InflationAdjustedReturnCalculator() {
  const [nominalReturn, setNominalReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const realReturn = ((1 + nominalReturn / 100) / (1 + inflation / 100) - 1) * 100;
  const simpleApprox = nominalReturn - inflation;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Real Return Calculator</CardTitle>
            <CardDescription className="text-slate-300">Inflation-Adjusted Return</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Nominal Return</Label>
            <NumericInput value={nominalReturn} onChange={setNominalReturn} min={0} sliderMax={30} suffix="%" />
          </div>
          <Slider min={1} max={30} step={0.5} value={[clamp(nominalReturn, 1, 30)]} onValueChange={([val]) => setNominalReturn(val)} className="py-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Inflation Rate</Label>
            <NumericInput value={inflation} onChange={setInflation} min={0} sliderMax={15} suffix="%" />
          </div>
          <Slider min={0} max={15} step={0.5} value={[clamp(inflation, 0, 15)]} onValueChange={([val]) => setInflation(val)} className="py-2" />
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
      </CardContent>
    </Card>
  );
}

export function StepUpSIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;

  let balance = 0;
  let invested = 0;
  let contribution = monthlyInvestment;
  for (let m = 1; m <= months; m++) {
    if (m > 1 && (m - 1) % 12 === 0) contribution = contribution * (1 + stepUp / 100);
    balance = (balance + contribution) * (1 + monthlyRate);
    invested += contribution;
  }
  const plainSip = monthlyRate > 0
    ? monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    : monthlyInvestment * months;
  const gain = balance - invested;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Step-Up SIP Calculator</CardTitle>
            <CardDescription className="text-slate-300">SIP that grows with your income</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Starting Monthly Investment</Label>
            <NumericInput value={monthlyInvestment} onChange={setMonthlyInvestment} min={0} sliderMax={100000} prefix="₹" step="500" />
          </div>
          <Slider min={500} max={100000} step={500} value={[clamp(monthlyInvestment, 500, 100000)]} onValueChange={([val]) => setMonthlyInvestment(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹500</span><span>₹1,00,000</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annual Step-Up</Label>
            <NumericInput value={stepUp} onChange={setStepUp} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={0} max={25} step={1} value={[clamp(stepUp, 0, 25)]} onValueChange={([val]) => setStepUp(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Annual Return</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={6} max={25} step={0.5} value={[clamp(rate, 6, 25)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Investment Duration</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>30 years</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Future Value</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(balance).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Invested</span>
            <span className="font-mono">₹{Math.round(invested).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Wealth Gained</span>
            <span className="font-mono text-emerald">+₹{Math.round(gain).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vs fixed SIP (no step-up)</span>
            <span className="font-mono">+₹{Math.round(balance - plainSip).toLocaleString("en-IN")} more</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GoalSIPCalculator() {
  const [target, setTarget] = useState(10000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const requiredSip = monthlyRate > 0
    ? (target * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate))
    : target / months;
  const totalInvested = requiredSip * months;
  const gain = target - totalInvested;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Goal SIP Calculator</CardTitle>
            <CardDescription className="text-slate-300">Monthly SIP needed to reach a target</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Target Corpus</Label>
            <NumericInput value={target} onChange={setTarget} min={0} sliderMax={50000000} prefix="₹" step="100000" />
          </div>
          <Slider min={100000} max={50000000} step={100000} value={[clamp(target, 100000, 50000000)]} onValueChange={([val]) => setTarget(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 lakh</span><span>₹5 crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Expected Annual Return</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={6} max={25} step={0.5} value={[clamp(rate, 6, 25)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Time to Goal</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>30 years</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Required Monthly SIP</span>
            <span className="text-xl font-bold font-mono text-emerald">₹{Math.round(requiredSip).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total You Invest</span>
            <span className="font-mono">₹{Math.round(totalInvested).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Growth Does the Rest</span>
            <span className="font-mono text-emerald">+₹{Math.round(gain).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoanPrepaymentCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [extra, setExtra] = useState(10000);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const emi = monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : principal / months;

  const baseInterest = emi * months - principal;

  let balance = principal;
  let paidInterest = 0;
  let m = 0;
  while (balance > 0 && m < 1200) {
    m++;
    const interest = balance * monthlyRate;
    paidInterest += interest;
    const principalPart = emi - interest + extra;
    balance -= principalPart;
  }
  const monthsSaved = Math.max(0, months - m);
  const interestSaved = Math.max(0, baseInterest - paidInterest);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">Loan Prepayment Calculator</CardTitle>
            <CardDescription className="text-slate-300">What an extra monthly payment saves</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Loan Amount</Label>
            <NumericInput value={principal} onChange={setPrincipal} min={0} sliderMax={20000000} prefix="₹" step="100000" />
          </div>
          <Slider min={100000} max={20000000} step={100000} value={[clamp(principal, 100000, 20000000)]} onValueChange={([val]) => setPrincipal(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹1 lakh</span><span>₹2 crore</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Interest Rate (p.a.)</Label>
            <NumericInput value={rate} onChange={setRate} min={0} sliderMax={15} suffix="%" />
          </div>
          <Slider min={6} max={15} step={0.1} value={[clamp(rate, 6, 15)]} onValueChange={([val]) => setRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>15%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Tenure</Label>
            <NumericInput value={years} onChange={setYears} min={1} sliderMax={30} suffix=" yr" step="1" />
          </div>
          <Slider min={1} max={30} step={1} value={[clamp(years, 1, 30)]} onValueChange={([val]) => setYears(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1 year</span><span>30 years</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Extra Payment per Month</Label>
            <NumericInput value={extra} onChange={setExtra} min={0} sliderMax={100000} prefix="₹" step="1000" />
          </div>
          <Slider min={0} max={100000} step={1000} value={[clamp(extra, 0, 100000)]} onValueChange={([val]) => setExtra(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹0</span><span>₹1,00,000</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly EMI</span>
            <span className="text-xl font-bold font-mono">₹{Math.round(emi).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Loan Closes Earlier By</span>
            <span className="font-mono text-emerald">{Math.floor(monthsSaved / 12)} yr {monthsSaved % 12} mo</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Interest Saved</span>
            <span className="font-mono text-emerald">+₹{Math.round(interestSaved).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Interest Without Prepayment</span>
            <span className="font-mono">₹{Math.round(baseInterest).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WACCCalculator() {
  const [equity, setEquity] = useState(700);
  const [debt, setDebt] = useState(300);
  const [costOfEquity, setCostOfEquity] = useState(14);
  const [costOfDebt, setCostOfDebt] = useState(9);
  const [taxRate, setTaxRate] = useState(25);

  const total = equity + debt;
  const we = total > 0 ? equity / total : 0;
  const wd = total > 0 ? debt / total : 0;
  const afterTaxRd = costOfDebt * (1 - taxRate / 100);
  const wacc = we * costOfEquity + wd * afterTaxRd;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gradient-slate">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-50">WACC Calculator</CardTitle>
            <CardDescription className="text-slate-300">Weighted average cost of capital</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-slate-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Equity Value</Label>
            <NumericInput value={equity} onChange={setEquity} min={0} sliderMax={10000} prefix="₹" suffix=" Cr" step="10" />
          </div>
          <Slider min={0} max={10000} step={10} value={[clamp(equity, 0, 10000)]} onValueChange={([val]) => setEquity(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹0 Cr</span><span>₹10,000 Cr</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Debt Value</Label>
            <NumericInput value={debt} onChange={setDebt} min={0} sliderMax={10000} prefix="₹" suffix=" Cr" step="10" />
          </div>
          <Slider min={0} max={10000} step={10} value={[clamp(debt, 0, 10000)]} onValueChange={([val]) => setDebt(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>₹0 Cr</span><span>₹10,000 Cr</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Cost of Equity</Label>
            <NumericInput value={costOfEquity} onChange={setCostOfEquity} min={0} sliderMax={25} suffix="%" />
          </div>
          <Slider min={6} max={25} step={0.25} value={[clamp(costOfEquity, 6, 25)]} onValueChange={([val]) => setCostOfEquity(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>6%</span><span>25%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Pre-Tax Cost of Debt</Label>
            <NumericInput value={costOfDebt} onChange={setCostOfDebt} min={0} sliderMax={15} suffix="%" />
          </div>
          <Slider min={4} max={15} step={0.25} value={[clamp(costOfDebt, 4, 15)]} onValueChange={([val]) => setCostOfDebt(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>4%</span><span>15%</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Tax Rate</Label>
            <NumericInput value={taxRate} onChange={setTaxRate} min={0} sliderMax={40} suffix="%" />
          </div>
          <Slider min={0} max={40} step={1} value={[clamp(taxRate, 0, 40)]} onValueChange={([val]) => setTaxRate(val)} className="py-2" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>40%</span></div>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">WACC</span>
            <span className="text-xl font-bold font-mono text-emerald">{wacc.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Equity Weight</span>
            <span className="font-mono">{(we * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Debt Weight</span>
            <span className="font-mono">{(wd * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">After-Tax Cost of Debt</span>
            <span className="font-mono">{afterTaxRd.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
