import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { log } from "../middleware/logger";

export default function RedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("shortenedUrls")) || [];
    const url = data.find(u => u.shortcode === code);
    if (!url) {
      log("frontend", "error", "handler", `Invalid shortcode accessed: ${code}`);
      return navigate("/");
    }

    if (Date.now() > url.expiry) {
      log("frontend", "warn", "handler", `Shortcode expired: ${code}`);
      return navigate("/");
    }

    url.clicks.push({
      timestamp: Date.now(),
      source: document.referrer || "direct",
      geo: "in" // stubbed geo data
    });

    localStorage.setItem("shortenedUrls", JSON.stringify(data));
    log("frontend", "info", "handler", `Redirected using shortcode: ${code}`);
    window.location.href = url.longUrl;
  }, [code, navigate]);

  return <p>Redirecting...</p>;
}
