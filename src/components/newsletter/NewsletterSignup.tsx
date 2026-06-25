import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // TODO: Replace with actual Buttondown API endpoint and key after Buttondown setup
      // POST to https://api.buttondown.email/v1/subscribers with Authorization: Token YOUR_API_KEY
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // TODO: Move API key to environment variable VITE_BUTTONDOWN_API_KEY
          Authorization: "Token YOUR_BUTTONDOWN_API_KEY",
        },
        body: JSON.stringify({ email_address: email, metadata: { name } }),
      });

      if (!res.ok) {
        throw new Error("Subscription failed. Please try again.");
      }

      setStatus("success");
      setEmail("");
      setName("");

      // Umami event
      if (typeof (window as any).umami !== "undefined") {
        (window as any).umami.track("Newsletter Signup");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <p className="font-semibold text-foreground">You're subscribed.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you. You'll hear from me roughly once a month.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6">
      <h3 className="font-semibold text-foreground">Stay in the loop</h3>
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
        <Button
          type="submit"
          className="w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
