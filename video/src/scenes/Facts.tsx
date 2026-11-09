// Scene 7. Four facts from the website, one at a time, each pushing the last one up and out.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { clamp, ease, headline } from "../theme";

const FACTS = ["Free and open source.", "No account. No telemetry.", "Windows, macOS and Linux.", "AI is optional."];
const FIRST = 6;
const EACH = 36;
export const FACTS_DURATION = FIRST + FACTS.length * EACH + 12;

const FactsInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop wallpaper="mesh" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {FACTS.map((fact, i) => {
          const start = FIRST + i * EACH;
          const enter = interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: ease.out });
          // Each fact is all but gone before the next one starts to rise
          const leave = i === FACTS.length - 1 ? 0 : interpolate(frame, [start + EACH - 7, start + EACH + 2], [0, 1], { ...clamp, easing: ease.in });
          if (enter === 0 || leave === 1) return null;
          return (
            <div
              key={fact}
              style={{
                position: "absolute",
                ...headline,
                fontSize: 136,
                textAlign: "center",
                whiteSpace: "nowrap",
                opacity: Math.min(enter, 1 - leave),
                translate: `0 ${(1 - enter) * 90 - leave * 90}px`,
                filter: `blur(${(1 - enter) * 12 + leave * 12}px)`,
              }}
            >
              {fact}
            </div>
          );
        })}
      </AbsoluteFill>
    </>
  );
};

export const Facts = Interactive.create({ Component: FactsInner, layout: "absolute-fill" });
