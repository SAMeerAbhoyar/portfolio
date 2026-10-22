import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip tracking when hostname is localhost
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return;
    }

    try {
      // Once per browser session
      if (sessionStorage.getItem("visit-logged")) {
        return;
      }
      sessionStorage.setItem("visit-logged", "true");

      // Fire-and-forget POST to /api/visit with keepalive: true, ignore all errors
      fetch("/api/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: document.referrer || "",
          path: window.location.pathname || "/",
          language: navigator.language || "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Ignore all errors
    }
  }, []);

  return null;
}
