"use client";

import { useEffect } from "react";

// Keeps a duplicate of the current URL behind the active history entry, so
// pressing the browser back button right after signing in lands on the same
// authenticated page instead of leaving the app / returning to a login form.
export function HistoryGuard() {
  useEffect(() => {
    window.history.pushState(window.history.state, "", window.location.href);
  }, []);

  return null;
}
