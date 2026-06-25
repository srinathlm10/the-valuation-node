import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";

function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (pw.length < 8) return { level: 0, label: "" };
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  if (hasLetter && hasNumber && hasSpecial) return { level: 3, label: "Strong" };
  if (hasLetter && hasNumber) return { level: 2, label: "Fair" };
  return { level: 1, label: "Weak" };
}

const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-emerald-500"] as const;
const strengthText = ["", "text-red-500", "text-yellow-500", "text-emerald-600"] as const;

export default function Signup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const strength = passwordStrength(password);

  const meetsPwRequirements = (pw: string) =>
    pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) { setError("Please enter your display name."); return; }
    if (!meetsPwRequirements(password)) {
      setError("Password must be at least 8 characters with at least one letter and one number.");
      return;
    }
    if (!agreed) { setError("Please agree to the Terms of Service and Privacy Policy."); return; }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { display_name: displayName },
      },
    });

    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setConfirmed(true);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await supabase.auth.resend({ type: "signup", email });
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleOAuth = async (provider: "google" | "github" | "linkedin_oidc") => {
    setOauthLoading(provider);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) { setError(authError.message); setOauthLoading(null); }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-[400px] text-center space-y-4">
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            Click the link in the email we sent to <strong>{email}</strong> to confirm your account.
          </p>
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="w-full"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend confirmation email"}
          </Button>
          <p className="text-xs text-muted-foreground">
            <Link to="/login" className="hover:underline">Back to sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-1">
          <Link to="/" className="font-bold text-xl tracking-tight text-foreground">
            The Valuation Node
          </Link>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Get personalised features and bookmarks</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* OAuth */}
        <div className="space-y-2">
          {(["google", "github", "linkedin_oidc"] as const).map((p) => (
            <Button
              key={p}
              variant="outline"
              className="w-full capitalize"
              onClick={() => handleOAuth(p)}
              disabled={!!oauthLoading}
              type="button"
            >
              {oauthLoading === p && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue with {p === "linkedin_oidc" ? "LinkedIn" : p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength.level >= i ? strengthColor[strength.level] : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className={`text-xs ${strengthText[strength.level]}`}>{strength.label}</p>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              At least 8 characters, with one letter and one number
            </p>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border"
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
              I agree to the{" "}
              <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
