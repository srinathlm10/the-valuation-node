import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  source?: string;
}

export function NewsletterSignup({ source = "site" }: Props) {
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

  if (status === "already") {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <p className="font-semibold text-foreground">Already subscribed.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          That email is already on the list — you're all set.
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
        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}
