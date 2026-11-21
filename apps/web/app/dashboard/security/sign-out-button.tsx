"use client";

import { useTransition } from "react";
import { revokeSessionAction } from "./actions";

export default function SignOutButton() {
  const [pending, startTransition] = useTransition();

  function signOutNow() {
    const confirmed = window.confirm(
      "Sign out of this browser?\n\nYou will need to authenticate again to reach the admin panel.",
    );
    if (!confirmed) return;
    startTransition(async () => {
      await revokeSessionAction();
    });
  }

  return (
    <button className="btn btn-ghost" type="button" onClick={signOutNow} disabled={pending}>
      {pending ? "Signing out…" : "Sign out of this browser"}
    </button>
  );
}
