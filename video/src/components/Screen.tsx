// A real HeadlessOS screenshot in a thin bezel, like the website's `.frame`.
import { Img, staticFile } from "remotion";

export type ScreenName = "home-hub" | "dashboard" | "files" | "docker" | "terminal" | "task-manager" | "server-admin";

export const Screen: React.FC<{ name: ScreenName; width: number; style?: React.CSSProperties }> = ({
  name,
  width,
  style,
}) => (
  <div
    style={{
      width,
      height: (width * 10) / 16,
      borderRadius: width * 0.014,
      overflow: "hidden",
      boxShadow: "0 0 0 1.5px rgba(255, 255, 255, 0.16), 0 40px 120px rgba(0, 0, 0, 0.55), 0 12px 30px rgba(0, 0, 0, 0.35)",
      backgroundColor: "#0b0f14",
      ...style,
    }}
  >
    <Img src={staticFile(`screens/${name}.webp`)} style={{ width: "100%", height: "100%", display: "block" }} />
  </div>
);
