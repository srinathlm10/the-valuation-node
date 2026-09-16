import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        if (typeof (window as any).umami !== "undefined") {
          (window as any).umami.track("Auth Error", { message: error.message });
        }
        navigate("/login?error=" + encodeURIComponent(error.message), { replace: true });
        return;
      }

      if (data.session) {
        const next = searchParams.get("next") || "/dashboard";
        navigate(next, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-muted-foreground">
      <Helmet>
        <title>Signing you in - The Valuation Node</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">Signing you in…</p>
    </div>
  );
}
