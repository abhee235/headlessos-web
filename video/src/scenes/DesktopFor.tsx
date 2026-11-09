// Scene 3. The website's hero line, "A desktop for your VPS / cloud server / home lab / Raspberry Pi",
// beside the Home hub tilting in from the right and running off the frame.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Screen } from "../components/Screen";
import { Words } from "../components/Words";
import { clamp, color, ease, headline } from "../theme";

const ROLL = ["VPS.", "cloud server.", "home lab.", "Raspberry Pi."];

/** The changing last line. Each word holds, then slides up and out as the next rises in. */
const RollingWord: React.FC<{ at: number; hold: number }> = ({ at, hold }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", height: "1.12em", overflow: "hidden" }}>
      {ROLL.map((word, i) => {
        const inStart = at + i * hold;
        const outStart = at + (i + 1) * hold;
        const enter = i === 0 ? 1 : interpolate(frame, [inStart - 10, inStart], [0, 1], { ...clamp, easing: ease.out });
        const leave = i === ROLL.length - 1 ? 0 : interpolate(frame, [outStart - 10, outStart], [0, 1], { ...clamp, easing: ease.in });
        return (
          <div
            key={word}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              translate: `0 ${(1 - enter) * 110 - leave * 110}%`,
              backgroundImage: `linear-gradient(90deg, ${color.cyan}, ${color.lilac})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              paddingBottom: "0.1em",
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

const DesktopForInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop wallpaper="celestial" />

      {/* The Home hub, tilting in and settling at an angle, its far side past the frame */}
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "30% 50%" }}>
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 90,
            transformOrigin: "left center",
            transform: `translateX(${interpolate(frame, [0, 1.3 * fps], [260, 0], { ...clamp, easing: ease.out })}px) translateY(${Math.sin(frame / 22) * 6}px) rotateY(${interpolate(frame, [0, 1.3 * fps], [-42, -17], { ...clamp, easing: ease.out })}deg)`,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], clamp),
          }}
        >
          <Screen name="home-hub" width={1440} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150 }}>
        <div style={{ ...headline, fontSize: 124 }}>
          <Words text="A desktop" at={0.15 * fps} stagger={5} />
          <Words text="for your" at={0.35 * fps} stagger={5} />
          <div
            style={{
              opacity: interpolate(frame, [0.55 * fps, 0.9 * fps], [0, 1], clamp),
              translate: `0 ${interpolate(frame, [0.55 * fps, 1.1 * fps], [40, 0], { ...clamp, easing: ease.out })}px`,
            }}
          >
            <RollingWord at={1.3 * fps} hold={0.95 * fps} />
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

export const DesktopFor = Interactive.create({ Component: DesktopForInner, layout: "absolute-fill" });
