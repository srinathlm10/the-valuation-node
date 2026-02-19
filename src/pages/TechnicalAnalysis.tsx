import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bot, TrendingUp, TrendingDown, BarChart3, CandlestickChart,
  Activity, Target, ShieldCheck, ArrowUpDown, Gauge, LineChart
} from "lucide-react";
import { Quiz } from "@/components/quiz/Quiz";

export function TechnicalAnalysisContent({ onAskAI }: { onAskAI: (context: string, message: string) => void }) {
  const handleAskAI = (topic: string, question: string) => {
    const context = `Technical Analysis: ${topic}`;
    onAskAI(context, question);
  };

  return (
    <div className="space-y-12">
      {/* Types of Charts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Types of Charts</h2>
            <p className="text-muted-foreground mr-1">Different ways to visualize price action</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAskAI("Types of Charts", "Explain the advantages of Candlestick charts over Line and Bar charts")}>
            <Bot className="mr-2 h-4 w-4" />Ask AI
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                Line Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connects closing prices with a continuous line. Good for seeing the overall
                trend but misses intraday volatility (highs and lows).
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                Bar Chart (OHLC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Shows Open, High, Low, and Close prices for each period using a vertical line
                and small horizontal ticks.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CandlestickChart className="h-5 w-5 text-emerald-500" />
                Candlestick Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The standard for traders. Uses "bodies" and "wicks" to clearly show the
                battle between buyers (bulls) and sellers (bears).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Types of Trends */}
      <section className="bg-muted/30 py-12 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-xl">
        <div className="">
          <h2 className="text-2xl font-bold mb-6">Types of Trends</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Uptrend (Bullish)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Sequence of <strong>Higher Highs (HH)</strong> and <strong>Higher Lows (HL)</strong>.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  Strategy: Buy on dips (Higher Lows).
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Downtrend (Bearish)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Sequence of <strong>Lower Highs (LH)</strong> and <strong>Lower Lows (LL)</strong>.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  Strategy: Sell on rallies (Lower Highs).
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-500" />
                  Sideways (Consolidation)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Price moves within a horizontal range (Rectangle). No clear trend.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  Strategy: Buy support, Sell resistance.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Sequence */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Professional Workflow Sequence</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { step: 1, title: "Define Strategy", desc: "Trend-following or mean-reversion based on market environment", icon: Target },
            { step: 2, title: "Identify Trend", desc: "Uptrend (higher highs/lows), Downtrend (lower highs/lows), or Sideways", icon: TrendingUp },
            { step: 3, title: "Support & Resistance", desc: "Mark levels where price historically pauses or reverses", icon: ArrowUpDown },
            { step: 4, title: "Chart Patterns", desc: "Look for geometric shapes signaling reversals or continuations", icon: LineChart },
            { step: 5, title: "Candlestick Patterns", desc: "Short-term visual cues for immediate market sentiment", icon: CandlestickChart },
            { step: 6, title: "Confirm with Indicators", desc: "Apply mathematical tools to validate price action signals", icon: Activity },
            { step: 7, title: "Risk Management", desc: "Set entry/exit points, stop-losses, and position size", icon: ShieldCheck },
            { step: 8, title: "Backtest", desc: "Validate strategy against historical data before live trading", icon: BarChart3 },
          ].map((item) => (
            <Card key={item.step} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {item.step}
              </div>
              <CardContent className="pt-6">
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Chart Patterns */}
      <section className="bg-muted/30 py-12 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-xl">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Chart Patterns (Structural Analysis)</h2>
              <p className="text-muted-foreground">55+ specific patterns to predict market outcomes</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleAskAI("Chart Patterns", "Explain the major chart patterns used in technical analysis with examples")}>
              <Bot className="mr-2 h-4 w-4" />Ask AI
            </Button>
          </div>

          <Tabs defaultValue="reversal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reversal">Reversal Patterns</TabsTrigger>
              <TabsTrigger value="continuation">Continuation Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="reversal">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      Head and Shoulders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      A peak (head) between two lower peaks (shoulders). A break below the "neckline"
                      signals a reversal from bullish to bearish.
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium">Signal: Bearish Reversal</p>
                      <p className="text-xs text-muted-foreground">Reliability: High when volume confirms</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowUpDown className="h-5 w-5 text-amber-600" />
                      Double Top / Double Bottom
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Price tests a resistance/support level twice and fails to break,
                      signaling a trend change.
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium">Signal: Trend Reversal</p>
                      <p className="text-xs text-muted-foreground">Double Top = Bearish, Double Bottom = Bullish</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      Inverted Head & Shoulders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Opposite of H&S. Three troughs with the middle one being the lowest (Head).
                      A break above the neckline is a strong buy signal.
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium">Signal: Bullish Reversal</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      Rounding Bottom
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      "Saucer" shape showing gradual shift from sellers to buyers.
                      Indicates long-term accumulation.
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium">Signal: Bullish Reversal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="continuation">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Triangles & Wedges</CardTitle>
                    <CardDescription>Signal that the trend will likely persist after consolidation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {[
                        { name: "Ascending Triangle", signal: "Bullish", desc: "Flat top, rising bottom" },
                        { name: "Descending Triangle", signal: "Bearish", desc: "Flat bottom, falling top" },
                        { name: "Symmetrical Triangle", signal: "Neutral", desc: "Converging trendlines" },
                      ].map((pattern) => (
                        <div key={pattern.name} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm mb-1">{pattern.name}</h4>
                          <Badge variant={pattern.signal === "Bullish" ? "default" : pattern.signal === "Bearish" ? "destructive" : "secondary"} className="mb-1 text-[10px]">
                            {pattern.signal}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground">{pattern.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flags & Pennants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-lg border-l-4 border-l-emerald-500">
                      <h4 className="font-medium mb-1">Bull Flag (Up Flag)</h4>
                      <p className="text-sm text-muted-foreground">
                        Sharp rise (pole) followed by a downward sloping channel.
                        Breakout resumes uptrend.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg border-l-4 border-l-red-500">
                      <h4 className="font-medium mb-1">Bear Flag (Down Flag)</h4>
                      <p className="text-sm text-muted-foreground">
                        Sharp drop (pole) followed by an upward sloping channel.
                        Breakout resumes downtrend.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Listing Breakout</CardTitle>
                    <CardDescription>Range Breakout / Box Pattern</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Price moves sideways in a "box" range. A strong candle breaking
                      the upper boundary signals a buy, while breaking the lower boundary signals a sell.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                      <p><span className="font-medium">Key:</span> Wait for candle close outside the box.</p>
                      <p><span className="font-medium">Fakeout:</span> If price reverses back in, exit immediately.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Candlestick Patterns */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Candlestick Analysis (Sentiment Analysis)</h2>
            <p className="text-muted-foreground">Individual or groups of candles highlight market emotions</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAskAI("Candlestick Patterns", "Explain the most important candlestick patterns and what they signal about market sentiment")}>
            <Bot className="mr-2 h-4 w-4" />Ask AI
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg">Hammer & Inverted Hammer</CardTitle>
              <Badge variant="outline" className="w-fit">Bullish Reversal</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Hammer:</strong> Short body, long lower wick. Buyers push price up after sell-off.<br />
                <strong>Inv. Hammer:</strong> Short body, long upper wick. Buyers testing higher levels.
              </p>
              <div className="text-xs bg-muted p-2 rounded">
                Found at <strong>Bottom</strong> of downtrend.
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg">Shooting Star & Hanging Man</CardTitle>
              <Badge variant="outline" className="w-fit">Bearish Reversal</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Shooting Star:</strong> Long upper wick. Sellers rejection.<br />
                <strong>Hanging Man:</strong> Long lower wick but appears at top. Weakening bulls.
              </p>
              <div className="text-xs bg-muted p-2 rounded">
                Found at <strong>Top</strong> of uptrend.
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg">Bullish Engulfing</CardTitle>
              <Badge variant="outline" className="w-fit">Strong Buy</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Large green candle completely covers previous red candle.
                Shows total shift in control to buyers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg">Bearish Engulfing</CardTitle>
              <Badge variant="outline" className="w-fit">Strong Sell</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Large red candle completely covers previous green candle.
                Sellers overwhelm buyers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg">Morning Star</CardTitle>
              <Badge variant="outline" className="w-fit">Bullish Reversal</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                3-Candle Pattern: Big Red &rarr; Small Body (Indecision) &rarr; Big Green.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg">Evening Star</CardTitle>
              <Badge variant="outline" className="w-fit">Bearish Reversal</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                3-Candle Pattern: Big Green &rarr; Small Body (Indecision) &rarr; Big Red.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Indicators */}
      <section className="bg-muted/30 py-12 -mx-4 px-4 sm:-mx-8 sm:px-8 rounded-xl">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Technical Indicators (Mathematical Confirmation)</h2>
              <p className="text-muted-foreground">Overlays on price charts & Oscillators plotted separately</p>
            </div>
          </div>

          <Tabs defaultValue="trend" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="trend">Trend Indicators</TabsTrigger>
              <TabsTrigger value="momentum">Momentum Oscillators</TabsTrigger>
              <TabsTrigger value="volume">Volume & Volatility</TabsTrigger>
            </TabsList>

            <TabsContent value="trend">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Simple Moving Average (SMA)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      The average price over a specific period (e.g., 50-day or 200-day).
                    </p>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                      SMA = Σ(Prices) / n
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("SMA", "Explain how to use Simple Moving Average (SMA) in trading with 50-day and 200-day examples")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exponential Moving Average (EMA)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Similar to SMA but more responsive to recent price changes.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <span className="font-medium">Use:</span> Better for short-term trading
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("EMA", "What's the difference between EMA and SMA? When should I use each?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bollinger Bands</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Lines plotted two standard deviations away from an SMA.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                      <p><span className="font-medium">Narrow bands:</span> Low volatility</p>
                      <p><span className="font-medium">Wide bands:</span> High volatility</p>
                      <p><span className="font-medium">Price at upper band:</span> Overbought</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("Bollinger Bands", "How do I use Bollinger Bands to identify overbought and oversold conditions?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fibonacci Retracement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Horizontal lines indicating where support/resistance are likely to occur
                      (23.6%, 38.2%, 50%, 61.8%).
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-xs">
                      <p><span className="font-medium">Golden Ratio:</span> 61.8% is key reversal level.</p>
                      <p className="text-muted-foreground mt-1">Drawn from Swing Low to Swing High.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("Fibonacci Retracement", "How do I draw Fibonacci Retracement levels correctly?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="momentum">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      RSI (Relative Strength Index)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Measures speed and magnitude of recent price changes (0-100 scale).
                    </p>
                    <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                      RSI = 100 - [100 / (1 + RS)]
                      <br />
                      RS = Avg Gain / Avg Loss
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">&gt;70 Overbought</Badge>
                      <Badge variant="default">&lt;30 Oversold</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("RSI", "How do I interpret RSI signals? What do divergences mean?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">MACD</CardTitle>
                    <CardDescription>Moving Average Convergence Divergence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Detects momentum shifts by comparing two EMAs.
                    </p>
                    <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                      MACD = 12-period EMA - 26-period EMA
                    </div>
                    <div className="text-xs space-y-1">
                      <p><span className="font-medium">Signal Line:</span> 9-period EMA of MACD</p>
                      <p><span className="font-medium">Crossover:</span> Buy/Sell signals</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("MACD", "Explain MACD crossovers and how to use them for trading signals")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stochastic Oscillator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Compares closing price to its price range over time.
                    </p>
                    <div className="p-3 bg-muted rounded-lg font-mono text-xs">
                      %K = 100 × [(C - L5) / (H5 - L5)]
                    </div>
                    <div className="text-xs text-muted-foreground">
                      C = Close, L5 = 5-day Low, H5 = 5-day High
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("Stochastic", "How do I use the Stochastic Oscillator to find overbought and oversold levels?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="volume">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">On-Balance Volume (OBV)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Measures the flow of volume to confirm trend strength. A rising OBV
                      alongside rising price confirms strong buyer support.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                      <p><span className="font-medium">Price Up + OBV Up:</span> Strong uptrend</p>
                      <p><span className="font-medium">Price Up + OBV Down:</span> Weak rally (divergence)</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("OBV", "How does On-Balance Volume help confirm trend strength?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average True Range (ATR)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Measures market volatility. Used for setting stop-losses.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-xs">
                      <p className="font-medium mb-1">ATR = Greatest of:</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        <li>Current High - Low</li>
                        <li>|Current High - Prev Close|</li>
                        <li>|Current Low - Prev Close|</li>
                      </ul>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => handleAskAI("ATR", "How do I use ATR to set proper stop-loss levels?")}>
                      <Bot className="mr-2 h-4 w-4" />Explain
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section >

      {/* Risk Management */}
      < section >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Risk Management Checklist</h2>
            <p className="text-muted-foreground">Technical analysis fails without strict discipline</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAskAI("Risk Management", "Explain position sizing and risk management for technical traders")}>
            <Bot className="mr-2 h-4 w-4" />Ask AI
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="entry">
                  <AccordionTrigger>Entry/Exit Plan</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Never enter a trade without knowing your target price. Define your profit target
                      and stop-loss before executing any trade.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stoploss">
                  <AccordionTrigger>Stop-Loss Placement</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Use volatility indicators like ATR to set stop-losses. Example: Place a stop
                      1 ATR away from entry to account for normal price fluctuations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ratio">
                  <AccordionTrigger>Risk/Reward Ratio</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Aim for at least a <strong>1:2 or 1:3 ratio</strong> to ensure profits outweigh
                      losses over time. If risking ₹100, target at least ₹200-300.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="position">
                  <AccordionTrigger>Position Sizing</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Calculate shares to buy so you only risk a small percentage (1-2%) of total
                      capital on a single trade. Never bet everything on one position.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                Golden Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span>Always trade with the trend, not against it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span>Wait for confirmation—don't anticipate breakouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span>Volume confirms price movements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">4.</span>
                  <span>Cut losses quickly, let winners run</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">5.</span>
                  <span>Backtest strategies before using real capital</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section >
      {/* Quiz Section */}
      <section>
        <Quiz articleId="technical-analysis-intro" />
      </section>
    </div>
  );
}

export default function TechnicalAnalysis() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(
    `You are helping users learn technical analysis for Indian stock markets.
Page: Technical Analysis Guide
Topics: Chart patterns, Technical indicators, Candlestick patterns, Support/Resistance
Key Indicators: Moving Averages (SMA, EMA), RSI, MACD, Bollinger Bands, Volume analysis
Chart Patterns: Head & Shoulders, Double Top/Bottom, Triangles, Flags, Wedges
Candlestick: Doji, Hammer, Engulfing, Morning/Evening Star
Trading Context:
- NSE/BSE trading hours: 9:15 AM - 3:30 PM IST
- Circuit breakers: 10%, 20% limits
- Delivery vs Intraday trading
Focus: Explain patterns visually, provide entry/exit strategies, risk management for Indian traders`
  );
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleAskAI = (topic: string, question: string) => {
    setChatContext(`Technical Analysis: ${topic}`);
    setInitialMessage(question);
    setChatOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-slate py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Technical Analysis Guide</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-hero-heading mb-4">
              Master Technical Analysis
            </h1>
            <p className="text-lg text-hero-subtext">
              Study historical market data—price and volume—to forecast future movements.
              Technical analysis assumes all known information is already reflected in the price.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <TechnicalAnalysisContent onAskAI={handleAskAI} />
      </div>

      <ChatSidebar
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        initialMessage={initialMessage}
        context={chatContext}
      />
    </Layout>
  );
}
