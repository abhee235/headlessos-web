// Client-side helpers for the download buttons.

export type OS = "windows" | "mac" | "linux";

export const OS_LABEL: Record<OS, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

/** Best guess at the visitor's desktop OS; null on phones and unknown platforms */
export function detectOS(): OS | null {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const p = (nav.userAgentData?.platform || navigator.platform || "").toLowerCase();
  const ua = navigator.userAgent.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(ua)) return null;
  if (p.includes("win") || ua.includes("windows")) return "windows";
  if (p.includes("mac") || ua.includes("mac os")) return "mac";
  if (p.includes("linux") || ua.includes("linux") || ua.includes("x11")) return "linux";
  return null;
}

/** Turns every [data-download-cta] into "Download for <OS>" pointing at that OS on /download */
export function labelDownloadButtons(): void {
  const os = detectOS();
  if (!os) return;
  document.querySelectorAll<HTMLAnchorElement>("[data-download-cta]").forEach((a) => {
    const label = a.querySelector("[data-download-label]");
    if (label) label.textContent = `Download for ${OS_LABEL[os]}`;
    a.href = `/download#${os}`;
  });
}
