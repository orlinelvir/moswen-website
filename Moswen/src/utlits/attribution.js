const KEY = "moswen_attr";
const TTL = 30 * 24 * 60 * 60 * 1000;
const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

export function readAttribution() {
  try {
    const a = JSON.parse(localStorage.getItem(KEY) || "null");
    if (a && a.ts && Date.now() - a.ts < TTL) return a;
  } catch (e) {}
  return {};
}

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    let attr = readAttribution();
    if (!attr.ts) {
      attr = { ts: Date.now(), landing: window.location.pathname, referrer: (document.referrer || "").slice(0, 200) };
    }
    let hasCampaign = false;
    CAMPAIGN_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) { attr[k] = v.slice(0, 100); hasCampaign = true; }
    });
    if (hasCampaign) attr.landing = window.location.pathname;
    const ref = params.get("ref");
    if (ref) attr.ref = ref.slice(0, 40);
    localStorage.setItem(KEY, JSON.stringify(attr));
  } catch (e) {}
}
