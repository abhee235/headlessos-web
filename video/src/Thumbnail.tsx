// The YouTube thumbnail (1280 x 720): the closing line, big, beside the Dashboard running off the edge.
import { AbsoluteFill } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { Mark, Wordmark } from "./components/Mark";
import { Screen } from "./components/Screen";
import { headline } from "./theme";

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Backdrop wallpaper="bloom" />
    <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "20% 50%" }}>
      <div style={{ position: "absolute", left: 640, top: 92, transformOrigin: "left center", transform: "rotateY(-16deg)" }}>
        <Screen name="dashboard" width={860} />
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{ padding: "64px 0 0 72px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Mark id="thumb" size={68} />
        <Wordmark size={50} />
      </div>
      <div style={{ ...headline, fontSize: 100, marginTop: 56, textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>
        Give every
        <br />
        server a
        <br />
        desktop.
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
