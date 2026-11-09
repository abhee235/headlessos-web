// Scene 5. How it works, in the website's words: it runs on your computer, not your server. Your
// computer and your server, joined by a line marked SSH with traffic moving both ways.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Mark } from "../components/Mark";
import { Words } from "../components/Words";
import { clamp, color, ease, geistMono, headline, manrope } from "../theme";

const LEFT_X = 560;
const RIGHT_X = 1360;
const NODE_Y = 630;
// The diagram is drawn at this size, then scaled up around its middle to fill the space under the headline
const DIAGRAM_SCALE = 1.2;

const Laptop: React.FC = () => (
  <div style={{ position: "relative", width: 330, height: 230 }}>
    <svg width="330" height="230" viewBox="0 0 330 230" fill="none" style={{ position: "absolute", inset: 0 }}>
      <rect x="40" y="8" width="250" height="168" rx="14" stroke="rgba(255,255,255,0.85)" strokeWidth="5" fill="rgba(10, 30, 45, 0.55)" />
      <path d="M12 196h306l-18 22H30z" fill="rgba(255,255,255,0.85)" />
    </svg>
    <div style={{ position: "absolute", left: 125, top: 52 }}>
      <Mark id="laptop" size={80} />
    </div>
  </div>
);

const Server: React.FC<{ blink: number }> = ({ blink }) => (
  <svg width="250" height="230" viewBox="0 0 250 230" fill="none">
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(15 ${12 + i * 72})`}>
        <rect width="220" height="58" rx="12" stroke="rgba(255,255,255,0.85)" strokeWidth="5" fill="rgba(10, 30, 45, 0.55)" />
        <circle cx="30" cy="29" r="6" fill={color.green} opacity={(blink + i) % 3 === 0 ? 1 : 0.45} />
        <rect x="56" y="25" width="120" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
      </g>
    ))}
  </svg>
);

const HowItWorksInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeIn = (start: number) => interpolate(frame, [start, start + 0.6 * fps], [0, 1], { ...clamp, easing: ease.out });
  const left = nodeIn(0.9 * fps);
  const right = nodeIn(1.15 * fps);
  const line = interpolate(frame, [1.5 * fps, 2.3 * fps], [0, 1], { ...clamp, easing: ease.inOut });
  const lineStart = LEFT_X + 200;
  const lineEnd = RIGHT_X - 160;

  return (
    <>
      <Backdrop wallpaper="ocean" />

      <AbsoluteFill style={{ paddingLeft: 150, paddingTop: 120 }}>
        <Words text="It runs on your computer," at={0.1 * fps} stagger={4} style={{ ...headline, fontSize: 104 }} />
        <Words text="not your server." at={0.45 * fps} stagger={4} style={{ ...headline, fontSize: 104, color: color.muted }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ scale: DIAGRAM_SCALE, transformOrigin: `960px ${NODE_Y + 60}px` }}>
      {/* Your computer */}
      <div
        style={{
          position: "absolute",
          left: LEFT_X - 165,
          top: NODE_Y - 150,
          opacity: left,
          translate: `0 ${(1 - left) * 40}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Laptop />
        <div style={{ fontFamily: manrope, fontWeight: 700, fontSize: 46, color: color.text, marginTop: 22 }}>Your computer</div>
        <div style={{ fontFamily: manrope, fontWeight: 600, fontSize: 32, color: color.muted, marginTop: 6 }}>Runs HeadlessOS</div>
      </div>

      {/* Your server */}
      <div
        style={{
          position: "absolute",
          left: RIGHT_X - 125,
          top: NODE_Y - 150,
          opacity: right,
          translate: `0 ${(1 - right) * 40}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 250,
        }}
      >
        <Server blink={Math.floor(frame / 9)} />
        <div style={{ fontFamily: manrope, fontWeight: 700, fontSize: 46, color: color.text, marginTop: 22, whiteSpace: "nowrap" }}>
          Your server
        </div>
        <div
          style={{
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 32,
            color: color.muted,
            marginTop: 6,
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [2.4 * fps, 2.9 * fps], [0, 1], clamp),
          }}
        >
          Keeps its own OS and config
        </div>
      </div>

      {/* The SSH link: a line that draws itself, with traffic both ways */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="link" x1={lineStart} x2={lineEnd} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color.cyan} />
            <stop offset="100%" stopColor={color.lilac} />
          </linearGradient>
        </defs>
        <line
          x1={lineStart}
          y1={NODE_Y - 40}
          x2={lineStart + (lineEnd - lineStart) * line}
          y2={NODE_Y - 40}
          stroke="url(#link)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="2 16"
        />
        {line >= 1
          ? [0, 1, 2, 3].map((i) => {
              const outbound = i % 2 === 0;
              const phase = ((frame - 2.3 * fps) / (1.1 * fps) + i * 0.27) % 1;
              const x = outbound ? lineStart + (lineEnd - lineStart) * phase : lineEnd - (lineEnd - lineStart) * phase;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={NODE_Y - 40}
                  r="9"
                  fill={outbound ? color.cyan : color.lilac}
                  opacity={Math.sin(Math.PI * phase)}
                  style={{ filter: `drop-shadow(0 0 10px ${outbound ? color.cyan : color.lilac})` }}
                />
              );
            })
          : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: (lineStart + lineEnd) / 2 - 75,
          top: NODE_Y - 125,
          width: 150,
          textAlign: "center",
          fontFamily: geistMono,
          fontWeight: 500,
          fontSize: 40,
          color: color.text,
          opacity: interpolate(frame, [1.9 * fps, 2.4 * fps], [0, 1], clamp),
        }}
      >
        SSH
      </div>

      {/* The point of the scene, under the server */}
      <div
        style={{
          position: "absolute",
          left: RIGHT_X,
          top: NODE_Y + 228,
          translate: "-50% 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 26px 14px 18px",
          borderRadius: 999,
          backgroundColor: "rgba(52, 199, 123, 0.16)",
          boxShadow: "inset 0 0 0 2px rgba(52, 199, 123, 0.6)",
          fontFamily: manrope,
          fontWeight: 700,
          fontSize: 36,
          color: "#c8f5dc",
          whiteSpace: "nowrap",
          opacity: interpolate(frame, [3.4 * fps, 3.8 * fps], [0, 1], clamp),
          scale: interpolate(frame, [3.4 * fps, 3.9 * fps], [0.6, 1], { ...clamp, easing: ease.out, output: "perceptual-scale" }),
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Nothing installed
      </div>
      </AbsoluteFill>
    </>
  );
};

export const HowItWorks = Interactive.create({ Component: HowItWorksInner, layout: "absolute-fill" });
