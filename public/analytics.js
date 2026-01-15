(function () {
  console.log("Insightica Analytics Loaded");
  console.log("Version 1.0.0");

  // Generate visitor ID
  function generateVisitorId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 10)
    );
  }

  const session_duration = 12 * 60 * 60 * 1000; // 12 hours
  const now = Date.now();

  let visitorId = localStorage.getItem("insightica_visitor_id");
  let sessionTimestamp = localStorage.getItem("insightica_session_time");
  if (!visitorId || (now - sessionTimestamp) > session_duration) {

    if(visitorId){
      localStorage.removeItem("insightica_visitor_id");
      localStorage.removeItem("insightica_session_time");
    }

    visitorId = generateVisitorId();
    localStorage.setItem("insightica_visitor_id", visitorId);
    localStorage.setItem("insightica_session_time", now);
  }

  const script = document.currentScript;
  if (!script) return;

  const websiteId = script.getAttribute("data-website-id");
  const domain = script.getAttribute("data-domain");

  const entryTime = Math.floor(Date.now() / 1000);

   const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source')||'';
    const utm_medium = urlParams.get('utm_medium')||'';
    const utm_campaign = urlParams.get('utm_campaign')||'';
    const RefParams=window.location.href.split ('?')[1]||'';

  // ENTRY EVENT
  fetch("https://insightica.vercel.app/api/track", {
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
  let activeStart = Math.floor(Date.now() / 1000);
  let totalActiveTime = 0;

  function pauseTracking() {
    totalActiveTime += Math.floor(Date.now() / 1000) - activeStart;
  }

  function resumeTracking() {
    activeStart = Math.floor(Date.now() / 1000);
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
      "https://insightica.vercel.app/api/track",
      JSON.stringify({
        type: "exit",
        websiteId,
        domain,
        visitorId,
        totalActiveTime,
        exitTime: Math.floor(Date.now() / 1000),
        exitUrl: window.location.href,
      })
    );
  }

  window.addEventListener("beforeunload", handleExit);

  const sendLivePing=()=>{
    fetch("https://insightica.vercel.app/api/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          websiteId,
          visitorId,
          last_seen:Date.now().toString(),
          url: window.location.href,
      }),
    });
  }
  setInterval(sendLivePing,10000); // every 10 sec
//   window.addEventListener("pagehide", handleExit);
})();
