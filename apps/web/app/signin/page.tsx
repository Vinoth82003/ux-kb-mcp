import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in — UX-KB",
  description: "Sign in with GitHub to create and manage your UX-KB API key.",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  AccessDenied: "That GitHub account is suspended or not permitted to sign in.",
  OAuthAccountNotLinked: "That email is already linked to another sign-in method.",
  OAuthSignin: "Could not start the GitHub sign-in. Try again.",
  OAuthCallback: "GitHub returned an invalid response. Try again.",
  Configuration: "Sign-in is not configured on this deployment.",
  Default: "Sign-in failed. Try again.",
};

function safeCallback(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const errorKey = params.error ?? "";
  const message = errorKey ? (ERRORS[errorKey] ?? ERRORS.Default) : null;

  return (
    <main className="container" style={{ padding: "96px 0", maxWidth: 560 }}>
      <p className="eyebrow" style={{ margin: 0 }}>
        UX-KB account
      </p>
      <h1 style={{ margin: "8px 0 12px", fontSize: "2rem", lineHeight: 1.15 }}>
        Sign in to get your API key
      </h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        UX-KB uses GitHub for identity only. It reads your public profile and
        verified email, then issues a key tied to your account.
      </p>

      {message && (
        <p
          role="alert"
          style={{
            margin: "16px 0",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #f87171",
            color: "#fecaca",
            background: "rgba(248, 113, 113, 0.08)",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </p>
      )}

      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: callbackUrl });
        }}
        style={{ marginTop: 24 }}
      >
        <button className="btn btn-primary" type="submit">
          Continue with GitHub
        </button>
      </form>

      <div className="card" style={{ marginTop: 32 }}>
        <h2 style={{ marginTop: 0, fontSize: "1rem" }}>What you get</h2>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--muted)", lineHeight: 1.7 }}>
          <li>Up to 3 active API keys, revocable at any time.</li>
          <li>60 requests per minute and 10,000 per day by default.</li>
          <li>90-day keys by default, with a one-click rotation.</li>
          <li>Usage history scoped to your own keys.</li>
        </ul>
      </div>

      <p style={{ marginTop: 24, fontSize: "0.85rem", color: "var(--muted)" }}>
        By signing in you agree to use the service within its rate limits.{" "}
        <Link href="/">Back to the overview</Link>
      </p>
    </main>
  );
}
