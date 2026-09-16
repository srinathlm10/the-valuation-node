import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  source?: string;
  /** "card": boxed block with its own heading. "sidebar": bare form for the prototype's Weekly Briefing sidebar section (the sidebar supplies the heading). */
  variant?: "card" | "sidebar";
  /** Heading element for the card variant, so the page outline stays in order. */
  headingLevel?: "h2" | "h3";
}

export function NewsletterSignup({ source = "site", variant = "card", headingLevel = "h2" }: Props) {
  const Heading = headingLevel;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const apiKey = import.meta.env.VITE_BUTTONDOWN_API_KEY as string | undefined;
      if (!apiKey) {
        throw new Error("Newsletter is not configured yet. Check back soon.");
      }

      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          metadata: { name, source },
        }),
      });

      if (res.status === 422) {
        // Buttondown returns 422 when the address is already subscribed
        setStatus("already");
        return;
      }

      if (!res.ok) {
        throw new Error("Subscription failed. Please try again.");
      }

      setStatus("success");
      setEmail("");
      setName("");

      if (typeof (window as any).umami !== "undefined") {
        (window as any).umami.track("Newsletter Signup", { source });
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const boxCls = variant === "sidebar" ? "" : "rounded-md border border-border bg-card p-6";

  if (status === "success") {
    return (
      <div className={`${boxCls} text-center`}>
        <p className="font-semibold text-foreground">You're subscribed.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you. You'll hear from me roughly once a month.
        </p>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className={`${boxCls} text-center`}>
        <p className="font-semibold text-foreground">Already subscribed.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          That email is already on the list. You're all set.
        </p>
      </div>
    );
  }

  if (variant === "sidebar") {
    // Prototype .newsletter-*: text, full-width square input, navy button.
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="mb-4 text-sm text-muted-foreground">
          Curated insights on valuation, ESG, and Indian markets, roughly once a month. No spam, no upsells.
        </p>
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">Email address</label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-navy px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-hover disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div className={boxCls}>
      <Heading className="font-semibold text-foreground">Stay in the loop</Heading>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        Roughly one email per month. No spam, no upsells.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="newsletter-name" className="text-sm">
            Name (optional)
          </Label>
          <Input
            id="newsletter-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="newsletter-email" className="text-sm">
            Email address
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
