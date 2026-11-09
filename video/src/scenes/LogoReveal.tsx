// Scene 2. The point of light from scene 1 flashes into the Bloom wallpaper; the mark grows out of it
// and draws its ring, the wordmark slides out beside it, and the line finishes: "Look at your server."
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Mark, Wordmark } from "../components/Mark";
import { Words } from "../components/Words";
import { clamp, color, ease, headline } from "../theme";

const LogoRevealInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#05070a" }} />
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 0.9 * fps], [0, 1], { ...clamp, easing: ease.out }) }}>
        <Backdrop wallpaper="bloom" />
      </AbsoluteFill>

      {/* The point of light, flashing outwards as a ring */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffffff 0%, rgba(160, 230, 255, 0.9) 22%, rgba(124, 58, 237, 0.35) 55%, transparent 72%)",
            opacity: interpolate(frame, [0, 0.35 * fps], [1, 0], clamp),
            scale: interpolate(frame, [0, 0.35 * fps], [1, 3], { ...clamp, easing: ease.out }),
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "3px solid rgba(170, 225, 255, 0.9)",
            boxShadow: "0 0 60px rgba(0, 212, 255, 0.55), inset 0 0 40px rgba(124, 58, 237, 0.4)",
            opacity: interpolate(frame, [0, 0.1 * fps, 0.9 * fps], [0, 0.9, 0], clamp),
            scale: interpolate(frame, [0, 0.9 * fps], [0.2, 9], { ...clamp, easing: ease.out }),
          }}
        />
      </AbsoluteFill>

      {/* Mark and wordmark: the row stays centred while the wordmark opens beside the mark */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", translate: "0 -70px" }}>
          <div
            style={{
              scale: interpolate(frame, [0.15 * fps, 1.1 * fps], [0.35, 1], {
                ...clamp,
                easing: ease.out,
                output: "perceptual-scale",
              }),
              rotate: interpolate(frame, [0.15 * fps, 1.1 * fps], ["-14deg", "0deg"], { ...clamp, easing: ease.out }),
              opacity: interpolate(frame, [0.15 * fps, 0.4 * fps], [0, 1], clamp),
              filter: "drop-shadow(0 18px 50px rgba(124, 58, 237, 0.55)) drop-shadow(0 0 30px rgba(0, 212, 255, 0.25))",
            }}
          >
            <Mark
              id="reveal"
              size={210}
              draw={interpolate(frame, [0.45 * fps, 1.45 * fps], [0, 1], { ...clamp, easing: ease.inOut })}
              letter={interpolate(frame, [1.1 * fps, 1.45 * fps], [0, 1], clamp)}
            />
          </div>
          <div
            style={{
              overflow: "hidden",
              maxWidth: interpolate(frame, [1.45 * fps, 2.35 * fps], [0, 980], { ...clamp, easing: ease.out }),
              marginLeft: interpolate(frame, [1.45 * fps, 2.0 * fps], [0, 44], { ...clamp, easing: ease.out }),
            }}
          >
            <Wordmark
              size={150}
              style={{
                translate: `${interpolate(frame, [1.45 * fps, 2.35 * fps], [-60, 0], { ...clamp, easing: ease.out })}px 0`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Words
          text="Look at your server."
          at={2.5 * fps}
          stagger={5}
          rise={20}
          style={{ ...headline, fontWeight: 700, fontSize: 76, color: color.muted, translate: "0 150px" }}
        />
      </AbsoluteFill>
    </>
  );
};

export const LogoReveal = Interactive.create({ Component: LogoRevealInner, layout: "absolute-fill" });
