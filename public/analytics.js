
(function () {
  console.log("✅ Insightica Analytics Loaded");
  console.log("Version 1.0.0");

  // Generate visitor ID
  function generateVisitorId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10)
    );
  }

  let visitorId = localStorage.getItem("insightica_visitor_id");
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem("insightica_visitor_id", visitorId);
  }

  const script = document.currentScript;
  if (!script) return;

  const websiteId = script.getAttribute("data-website-id");
  const domain = script.getAttribute("data-domain");

  const entryTime = Date.now();

   const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source')||'';
    const utm_medium = urlParams.get('utm_medium')||'';
    const utm_campaign = urlParams.get('utm_campaign')||'';
    const RefParams=window.location.href.split ('?')[1]||'';

  // ENTRY EVENT
  fetch("http://localhost:3000/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        type: "entry",
        websiteId,
        domain,
        url: window.location.href,
        referrer: document.referrer || "direct",
        visitorId,
        entryTime,
        urlParams,
        utm_source,
        utm_medium,
        utm_campaign,
        RefParams
    }),
  });

  // ACTIVE TIME TRACKING
  let activeStart = Date.now();
  let totalActiveTime = 0;

  function pauseTracking() {
    totalActiveTime += Date.now() - activeStart;
  }

  function resumeTracking() {
    activeStart = Date.now();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseTracking();
    } else {
      resumeTracking();
    }
  });

  function handleExit() {
    pauseTracking();

    navigator.sendBeacon(
      "http://localhost:3000/api/track",
      JSON.stringify({
        type: "exit",
        websiteId,
        domain,
        visitorId,
        totalActiveTime,
        exitTime: Date.now(),
      })
    );
  }

  window.addEventListener("beforeunload", handleExit);
//   window.addEventListener("pagehide", handleExit);
})();
