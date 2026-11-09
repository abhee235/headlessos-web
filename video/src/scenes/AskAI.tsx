// Scene 6. The AI agent, acting out the website's own example conversation: a question, an answer with
// what it looked at, a change that waits for approval, and the click on Approve. The card is marked
// "Example", as it is on the site. It answers the 91%-full disk from scene 1.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import { clamp, color, ease, geistMono, headline, manrope } from "../theme";

const QUESTION = "Why is the disk on / almost full?";
const ANSWER: { text: string; code?: boolean }[] = [
  { text: "/var/lib/docker", code: true },
  ...("takes 74 GB of the 96 GB disk. Most of it is six images no container uses.".split(" ").map((text) => ({ text }))),
];

const TINT = "#e6ecee";
const SUB = "#5c6b72";

const appear = (frame: number, start: number, length = 12) =>
  interpolate(frame, [start, start + length], [0, 1], { ...clamp, easing: ease.out });

/** Opens a section of the card, so the card grows as the conversation does */
const opening = (frame: number, start: number, length: number) =>
  interpolate(frame, [start, start + length], [0, 1], { ...clamp, easing: ease.inOut });

const Card: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typed = Math.round(interpolate(frame, [1.0 * fps, 2.4 * fps], [0, QUESTION.length], clamp));
  const answerOpen = opening(frame, 2.45 * fps, 14);
  const lookedAtOpen = opening(frame, 3.85 * fps, 14);
  const lookedAt = appear(frame, 4.05 * fps);
  const askOpen = opening(frame, 4.8 * fps, 16);
  const ask = appear(frame, 5.0 * fps);
  const click = 7.0 * fps;
  const pressed = interpolate(frame, [click, click + 3, click + 7], [1, 0.94, 1], clamp);
  const approved = appear(frame, click + 8, 10);

  // The cursor travels to Approve, from below and to the right
  const travel = interpolate(frame, [5.9 * fps, click - 2], [0, 1], { ...clamp, easing: ease.inOut });

  return (
    <div
      style={{
        width: 780,
        padding: 44,
        borderRadius: 34,
        backgroundColor: color.paper,
        color: color.ink,
        fontFamily: manrope,
        boxShadow: "0 50px 120px rgba(10, 0, 30, 0.55), 0 0 0 1px rgba(255,255,255,0.5)",
        opacity: appear(frame, 0.3 * fps, 16),
        translate: `0 ${interpolate(frame, [0.3 * fps, 0.9 * fps], [60, 0], { ...clamp, easing: ease.out })}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 34 }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#6a4fb0" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        AI agent
        <span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700, color: SUB }}>Example</span>
      </div>

      {/* The question, typed into a bubble already its final size */}
      <div
        style={{
          marginTop: 30,
          marginLeft: "auto",
          width: "fit-content",
          maxWidth: "88%",
          padding: "18px 28px",
          borderRadius: "28px 28px 8px 28px",
          backgroundColor: TINT,
          fontSize: 34,
          fontWeight: 600,
          opacity: appear(frame, 0.85 * fps, 8),
        }}
      >
        {QUESTION.slice(0, typed)}
        <span style={{ color: "transparent" }}>{QUESTION.slice(typed)}</span>
      </div>

      <div
        style={{
          marginTop: 30 * answerOpen,
          maxHeight: 150 * answerOpen,
          overflow: "hidden",
          fontSize: 32,
          lineHeight: 1.45,
          color: "#34434b",
          fontWeight: 500,
        }}
      >
        {ANSWER.map((word, i) => (
          <span key={i} style={{ opacity: appear(frame, 2.6 * fps + i * 2, 8) }}>
            {word.code ? (
              <span style={{ fontFamily: geistMono, fontSize: 29, color: color.ink, fontWeight: 500 }}>{word.text}</span>
            ) : (
              word.text
            )}{" "}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 22 * lookedAtOpen,
          maxHeight: 170 * lookedAtOpen,
          overflow: "hidden",
          padding: `${16 * lookedAtOpen}px 24px`,
          borderRadius: 20,
          backgroundColor: TINT,
          fontSize: 28,
          lineHeight: 1.7,
          opacity: lookedAt,
          translate: `0 ${(1 - lookedAt) * 16}px`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: SUB }}>What it looked at</div>
        {[
          ["Disk · /", "91% used"],
          ["Docker · images", "6 unused"],
        ].map(([label, value], i) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", opacity: appear(frame, 4.3 * fps + i * 6, 8) }}>
            <span>{label}</span>
            <span style={{ fontFamily: geistMono, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 28 * askOpen,
          paddingTop: 26 * askOpen,
          maxHeight: 290 * askOpen,
          // Not hidden: the cursor comes in from outside the card
          overflow: askOpen < 1 ? "hidden" : "visible",
          borderTop: `1.5px solid rgba(16, 32, 42, ${0.14 * askOpen})`,
          opacity: ask,
          translate: `0 ${(1 - ask) * 16}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 700 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b7791f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Remove 6 unused Docker images?
        </div>
        <div style={{ marginTop: 4, marginLeft: 46, fontSize: 26, color: SUB, fontWeight: 500 }}>
          This changes the server, so it waits for you.
        </div>

        <div style={{ position: "relative", marginTop: 24, height: 68 }}>
          {/* The two buttons, until Approve is clicked */}
          <div style={{ display: "flex", gap: 14, opacity: 1 - approved }}>
            <div
              style={{
                position: "relative",
                padding: "16px 34px",
                borderRadius: 999,
                background: color.pill,
                color: "#fff",
                fontSize: 30,
                fontWeight: 700,
                scale: pressed,
                boxShadow: "0 0 0 1.5px rgba(255,255,255,0.85) inset, 0 4px 18px rgba(106, 79, 176, 0.45)",
              }}
            >
              Approve
              {/* The cursor, drawn relative to the button it clicks */}
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                style={{
                  position: "absolute",
                  left: "62%",
                  top: "55%",
                  translate: `${(1 - travel) * 300}px ${(1 - travel) * 210}px`,
                  opacity: interpolate(frame, [5.8 * fps, 6.0 * fps, click + 14, click + 22], [0, 1, 1, 0], clamp),
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
                }}
              >
                <path d="M5 3l14 8.5-6.3 1.4 3.6 6.6-2.6 1.4-3.6-6.6L5 18.5z" fill="#ffffff" stroke="#10202a" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div
              style={{
                padding: "16px 34px",
                borderRadius: 999,
                backgroundColor: "#ffffff",
                boxShadow: "inset 0 0 0 1.5px rgba(16, 32, 42, 0.2)",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              Deny
            </div>
          </div>

          {/* What happened */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
              fontWeight: 500,
              color: "#34434b",
              opacity: approved,
              translate: `0 ${(1 - approved) * 12}px`,
            }}
          >
            <span
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                backgroundColor: "rgba(52, 199, 123, 0.16)",
                color: "#137a47",
                fontWeight: 700,
                fontSize: 26,
              }}
            >
              Approved
            </span>
            Removed, and written to the audit log.
          </div>
        </div>
      </div>
    </div>
  );
};

const AskAIInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop wallpaper="amethyst" />

      <AbsoluteFill style={{ paddingLeft: 150, justifyContent: "center", paddingBottom: 60 }}>
        <Words text="Ask your server" at={0.1 * fps} stagger={4} style={{ ...headline, fontSize: 98 }} />
        <Words text="what's wrong." at={0.3 * fps} stagger={4} style={{ ...headline, fontSize: 98 }} />
        <div
          style={{
            marginTop: 40,
            maxWidth: 740,
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1.3,
            color: color.muted,
            letterSpacing: "-0.01em",
            opacity: appear(frame, 5.2 * fps, 14),
            translate: `0 ${(1 - appear(frame, 5.2 * fps, 14)) * 20}px`,
          }}
        >
          Nothing on the server changes until you say yes.
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 740,
            fontFamily: manrope,
            fontWeight: 600,
            fontSize: 32,
            lineHeight: 1.35,
            color: color.faint,
            opacity: appear(frame, 7.8 * fps, 14),
          }}
        >
          Works with OpenAI, Claude, or a local Ollama model.
        </div>
      </AbsoluteFill>

      {/* The card stays centred as it grows */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-end", paddingRight: 150 }}>
        <Card />
      </AbsoluteFill>
    </>
  );
};

export const AskAI = Interactive.create({ Component: AskAIInner, layout: "absolute-fill" });
