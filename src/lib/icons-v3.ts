/**
 * HeadlessOS — Ring-Tick H mark (chosen icon).
 *
 * Single parameter that matters:
 *   - angle: where the leading tick dot sits on the ring.
 *            0° = top, clockwise (0, 90, 180, 270 = N, E, S, W)
 */

type Variant = "brand" | "dark" | "flat";

export interface RingTickOptions {
  angle?: number;       // 0 = top, clockwise. Default 0.
  arcSpan?: number;     // degrees of visible arc, ends at the dot. Default 270.
  dotSize?: number;     // dot radius in 64-unit viewBox. Default 2.2.
  variant?: Variant;    // background style
  stroke?: number;      // ring stroke width. Default 2.5.
  overrideDotColor?: string;
}

const C = { cyan: "#00d4ff", violet: "#7c3aed" };

const defs = `
  <defs>
    <linearGradient id="rt-brand" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.cyan}"/>
      <stop offset="1" stop-color="${C.violet}"/>
    </linearGradient>
    <linearGradient id="rt-dark" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1a1a2a"/>
      <stop offset="1" stop-color="#07070b"/>
    </linearGradient>
    <linearGradient id="rt-sheen" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

function tileBackground(variant: Variant): string {
  if (variant === "flat") return "";
  const fill = variant === "brand" ? "url(#rt-brand)" : "url(#rt-dark)";
  return `
    <rect x="0" y="0" width="64" height="64" rx="14" ry="14" fill="${fill}"/>
    <rect x="0" y="0" width="64" height="32" rx="14" ry="14" fill="url(#rt-sheen)"/>
  `;
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  // 0° = top, clockwise
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function renderRingTick(opts: RingTickOptions = {}): string {
  const {
    angle = 0,
    arcSpan = 270,
    dotSize = 2.2,
    variant = "brand",
    stroke = 2.5,
    overrideDotColor,
  } = opts;

  const cx = 32, cy = 32, r = 18;
  const gap = 360 - arcSpan;
  const arcStart = angle + gap;   // arc runs clockwise, ends at the dot
  const arcEnd = angle;

  const [x1, y1] = polar(cx, cy, r, arcStart);
  const [x2, y2] = polar(cx, cy, r, arcEnd);
  const largeArc = arcSpan > 180 ? 1 : 0;

  const arcPath = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  const [dx, dy] = polar(cx, cy, r, angle);

  const strokeColor = variant === "flat" ? "currentColor" : "#ffffff";
  const dotColor = overrideDotColor ?? strokeColor;
  const trackOpacity = 0.15;

  return `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  ${defs}
  ${tileBackground(variant)}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${strokeColor}" stroke-opacity="${trackOpacity}" stroke-width="${stroke}"/>
  <path d="${arcPath}" fill="none" stroke="${strokeColor}" stroke-width="${stroke}" stroke-linecap="round"/>
  <circle cx="${dx.toFixed(2)}" cy="${dy.toFixed(2)}" r="${dotSize}" fill="${dotColor}"/>
  <g fill="${strokeColor}">
    <rect x="24" y="23" width="3" height="18" rx="1"/>
    <rect x="37" y="23" width="3" height="18" rx="1"/>
    <rect x="24" y="30.5" width="16" height="3" rx="1"/>
  </g>
</svg>`;
}

// Angle study — 16 positions around the clock
export const angleStudy: { label: string; angle: number }[] = [
  { label: "0° — top",       angle: 0 },
  { label: "22°",            angle: 22 },
  { label: "45° — ne",       angle: 45 },
  { label: "67°",            angle: 67 },
  { label: "90° — right",    angle: 90 },
  { label: "112°",           angle: 112 },
  { label: "135° — se",      angle: 135 },
  { label: "157°",           angle: 157 },
  { label: "180° — bottom",  angle: 180 },
  { label: "202°",           angle: 202 },
  { label: "225° — sw",      angle: 225 },
  { label: "247°",           angle: 247 },
  { label: "270° — left",    angle: 270 },
  { label: "292°",           angle: 292 },
  { label: "315° — nw",      angle: 315 },
  { label: "337°",           angle: 337 },
];
