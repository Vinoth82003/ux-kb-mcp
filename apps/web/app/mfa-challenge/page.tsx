import { requireUser } from "@/lib/authz";
import MfaChallengeForm from "./mfa-challenge-form";

export const dynamic = "force-dynamic";

export default async function MfaChallengePage() {
  const user = await requireUser();

  return (
    <main className="signin-page">
      <div className="signin-shell" style={{ gridTemplateColumns: "1fr" }}>
        <section className="signin-card" aria-labelledby="mfa-title" style={{ maxWidth: 480, margin: "0 auto" }}>
          <p className="eyebrow signin-eyebrow">Two-factor verification</p>
          <h1 id="mfa-title" className="signin-title">
            Enter your authenticator code
          </h1>
          <p className="signin-subtitle">
            Hi {user.name?.split(" ")[0] ?? user.login}, your account has two-factor
            authentication enabled. Verify to finish signing in.
          </p>
          <MfaChallengeForm />
        </section>
      </div>
    </main>
  );
}
