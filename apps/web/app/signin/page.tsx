import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="container" style={{ padding: "96px 0" }}>
      <h1>Sign in</h1>
      <p className="section-lede">Admin access requires a GitHub account on the allowlist.</p>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button className="btn btn-primary" type="submit">
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}
