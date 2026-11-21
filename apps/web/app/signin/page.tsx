import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in — UX-KB",
  description: "Sign in with GitHub to create and manage your UX-KB API key.",
  robots: { index: false, follow: false },
};

const devAuth = process.env.DEV_AUTH === "1" && process.env.NODE_ENV !== "production";

const DEV_ROLES = ["member", "admin"];

const ERRORS: Record<string, string> = {
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
    <main className="signin-page">
      <div className="signin-shell">
        <section className="signin-card" aria-labelledby="signin-title">
          <Link className="signin-brand" href="/" aria-label="UX-KB home">
            <img
              className="signin-brand-mark"
              src="/mascot/pose-01-brand-mark.svg"
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              decoding="async"
            />
            <span>UX-KB</span>
          </Link>

          <p className="eyebrow signin-eyebrow">UX-KB account</p>
          <h1 id="signin-title" className="signin-title">
            Welcome back to UX-KB.
          </h1>
          <p className="signin-subtitle">Your design knowledge companion is ready.</p>

          {message && (
            <p role="alert" className="signin-alert">
              {message}
            </p>
          )}

          <form
            className="signin-form"
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: callbackUrl });
            }}
          >
            <button className="btn btn-primary signin-github" type="submit">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.41-2.7 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
              Sign in with GitHub
            </button>
          </form>

          {devAuth && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Dev login (DEV_AUTH=1)</p>
              {DEV_ROLES.map((role) => (
                <form
                  key={role}
                  action={async () => {
                    "use server";
                    await signIn("dev", { email: `${role}@dev.local`, password: process.env.DEV_PASSWORD ?? "dev", redirectTo: callbackUrl });
                  }}
                  style={{ display: "inline-block", marginRight: 8, marginBottom: 8 }}
                >
                  <button className="btn btn-ghost" type="submit">
                    Sign in as {role}
                  </button>
                </form>
              ))}
            </div>
          )}
          <p className="signin-trust">
            <img
              className="signin-trust-mascot"
              src="/mascot/pose-08-guardian.svg"
              alt=""
              aria-hidden="true"
              width={46}
              height={42}
              decoding="async"
            />
            <span>We securely authenticate via GitHub. We never see your password.</span>
          </p>

          <p className="signin-back">
            <Link href="/">Back to the overview</Link>
          </p>
        </section>

        <aside className="signin-welcome" aria-labelledby="signin-welcome-title">
          <img
            className="signin-welcome-mascot"
            src="/mascot/pose-02-confident-expert.svg"
            alt="UX-KB Guide mascot, confident expert pose, welcoming you back"
            width={320}
            height={293}
            loading="eager"
            decoding="async"
          />
          <h2 id="signin-welcome-title" className="signin-welcome-title">
            Everything is where you left it.
          </h2>
          <p className="signin-welcome-copy">
            Sign in to reach your keys, usage, and the verified knowledge base behind them.
          </p>
          <ul className="signin-benefits">
            <li>Up to 5 active API keys, revocable at any time.</li>
            <li>60 requests per minute and 10,000 per day by default.</li>
            <li>90-day keys by default, with a one-click rotation.</li>
            <li>Usage history scoped to your own keys.</li>
          </ul>
        </aside>
      </div>

      <footer className="signin-footer">
        <img
          className="signin-footer-mascot"
          src="/mascot/pose-12-friendly-companion.svg"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
        />
        <span>UX-KB · Content release candidate 2.0.0 · MIT license</span>
      </footer>
    </main>
  );
}
