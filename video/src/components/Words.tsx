// Kinetic type: each word rises out of its own mask, one after another.
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, ease } from "../theme";

export const Words: React.FC<{
  text: string;
  /** Frame the first word starts on */
  at?: number;
  /** Frames between words */
  stagger?: number;
  /** Frames each word takes to rise */
  rise?: number;
  style?: React.CSSProperties;
  /** Style for one word, by index (a coloured last word, say) */
  wordStyle?: (index: number) => React.CSSProperties | undefined;
}> = ({ text, at = 0, stagger = 4, rise = 18, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");

  return (
    <div style={style}>
      {words.map((word, i) => {
        const start = at + i * stagger;
        const p = interpolate(frame, [start, start + rise], [0, 1], { ...clamp, easing: ease.out });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              // Room for descenders, so the mask doesn't clip g, p and y
              paddingBottom: "0.12em",
              marginBottom: "-0.12em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0 ${(1 - p) * 105}%`,
                opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
                ...wordStyle?.(i),
              }}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </div>
  );
};
