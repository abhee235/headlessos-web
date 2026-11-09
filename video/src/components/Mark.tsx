// The HeadlessOS mark from the website's logo, with its parts exposed so the ring can draw itself in.
import { geist } from "../theme";

export const Mark: React.FC<{
  size: number;
  /** 0 to 1: how much of the ring is drawn */
  draw?: number;
  /** 0 to 1: the H inside the ring */
  letter?: number;
  /** Unique per instance, for the gradient ids */
  id: string;
}> = ({ size, draw = 1, letter = 1, id }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", overflow: "visible" }}>
    <defs>
      <linearGradient id={`${id}a`} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00D4FF" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#${id}a)`} />
    <rect x="2" y="2" width="44" height="22" rx="11" fill={`url(#${id}b)`} />
    <circle cx="24" cy="24" r="12.5" fill="none" stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={2} />
    <path
      d="M 32.84 32.84 A 12.5 12.5 0 1 1 32.84 15.16"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
    <circle cx="32.84" cy="15.16" r="1.6" fill="#FFFFFF" opacity={draw >= 0.98 ? 1 : 0} />
    <g fill="#FFFFFF" opacity={letter}>
      <rect x="18.6" y="17.7" width="2.2" height="12.6" rx="0.8" />
      <rect x="27.4" y="17.7" width="2.2" height="12.6" rx="0.8" />
      <rect x="18.6" y="23.0" width="11" height="2.2" rx="0.8" />
    </g>
  </svg>
);

/** "HeadlessOS" set like the website's wordmark: Geist, with "OS" in the brand cyan */
export const Wordmark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      fontFamily: geist,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "-0.02em",
      lineHeight: 1,
      color: "#f3f6f8",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    Headless<span style={{ color: "#00d4ff" }}>OS</span>
  </div>
);
