// Scene 8. The website's closing line, the logo, and where to get it.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Mark, Wordmark } from "../components/Mark";
import { Words } from "../components/Words";
import { clamp, color, ease, headline, manrope } from "../theme";

const OutroInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = interpolate(frame, [0, 0.8 * fps], [0, 1], { ...clamp, easing: ease.out });
  const cta = interpolate(frame, [1.4 * fps, 2.0 * fps], [0, 1], { ...clamp, easing: ease.out });
  // A highlight sweeps across the address once it has settled
  const sweep = interpolate(frame, [2.4 * fps, 3.2 * fps], [-30, 130], { ...clamp, easing: ease.inOut });

  return (
    <>
      <Backdrop wallpaper="golden-hour" dim={0.15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            opacity: logo,
            scale: interpolate(logo, [0, 1], [0.85, 1]),
            filter: "drop-shadow(0 14px 40px rgba(0, 0, 0, 0.35))",
          }}
        >
          <Mark id="outro" size={132} />
          <Wordmark size={96} />
        </div>

        <Words
          text="Give every server a desktop."
          at={0.5 * fps}
          stagger={4}
          rise={18}
          style={{ ...headline, fontSize: 112, marginTop: 70, textAlign: "center", textShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
        />

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 72,
            padding: "22px 56px",
            borderRadius: 999,
            background: color.pill,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.85) inset, 0 10px 40px rgba(88, 63, 152, 0.55)",
            fontFamily: manrope,
            fontWeight: 700,
            fontSize: 52,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            opacity: cta,
            translate: `0 ${(1 - cta) * 30}px`,
          }}
        >
          headlessos.com
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(100deg, transparent ${sweep - 18}%, rgba(255,255,255,0.45) ${sweep}%, transparent ${sweep + 18}%)`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 36,
            color: color.text,
            opacity: interpolate(frame, [1.8 * fps, 2.3 * fps], [0, 0.85], clamp),
          }}
        >
          Free for Windows, macOS and Linux
        </div>
      </AbsoluteFill>
    </>
  );
};

export const Outro = Interactive.create({ Component: OutroInner, layout: "absolute-fill" });
