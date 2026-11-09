// A scene's background: one of the app's own wallpapers, drifting slowly so the frame never sits still,
// with a vignette that keeps the edges quiet.
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type Wallpaper = "graphite" | "bloom" | "celestial" | "ocean" | "amethyst" | "golden-hour" | "mesh";

export const Backdrop: React.FC<{ wallpaper: Wallpaper; dim?: number }> = ({ wallpaper, dim = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a" }}>
      <Img
        src={staticFile(`wallpapers/${wallpaper}.svg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, durationInFrames], [1.04, 1.12]),
        }}
      />
      {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(4, 6, 9, ${dim})` }} /> : null}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 75% 70% at 50% 46%, transparent 50%, rgba(0, 0, 0, 0.6) 100%)" }}
      />
    </AbsoluteFill>
  );
};
