// Scene 4. A camera flies over a wall of six real HeadlessOS windows, stopping on each with one line
// about it, then pulls back to show them all: "Everything you SSH in for, already open."
// Each line restates that app's docs page, so nothing here promises more than the app does.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Screen, type ScreenName } from "../components/Screen";
import { Words } from "../components/Words";
import { clamp, color, ease, headline, manrope } from "../theme";

// The wall, in world pixels: three columns, two rows of 1600 x 1000 windows
const W = 1600;
const H = 1000;
const GAP = 140;
const WORLD_CX = (3 * W + 2 * GAP) / 2;
const WORLD_CY = (2 * H + GAP) / 2;

type Stop = { screen: ScreenName; name: string; line: string; col: number; row: number };

// The camera snakes along the top row, then back along the bottom one
const STOPS: Stop[] = [
  { screen: "dashboard", name: "Dashboard", line: "CPU, memory, disk and network, live.", col: 0, row: 0 },
  { screen: "files", name: "File Explorer", line: "Browse, edit and upload files over SFTP.", col: 1, row: 0 },
  { screen: "docker", name: "Docker", line: "Containers, their logs, and a shell inside.", col: 2, row: 0 },
  { screen: "terminal", name: "Terminal", line: "A real SSH shell. vim, htop and tmux work.", col: 2, row: 1 },
  { screen: "task-manager", name: "Task Manager", line: "Every process, and what it is using, live.", col: 1, row: 1 },
  { screen: "server-admin", name: "Server Admin", line: "Firewall, users, nginx, packages and cron.", col: 0, row: 1 },
];

const centre = (s: Stop) => ({ x: s.col * (W + GAP) + W / 2, y: s.row * (H + GAP) + H / 2 });

type Cam = { x: number; y: number; s: number; sy: number };
const OVERVIEW_START: Cam = { x: WORLD_CX, y: WORLD_CY, s: 0.335, sy: 540 };
const OVERVIEW_END: Cam = { x: WORLD_CX, y: WORLD_CY, s: 0.335, sy: 650 };
const FOCUS_SCALE = 0.72;
const FOCUS_SY = 420;
const at = (s: Stop): Cam => ({ ...centre(s), s: FOCUS_SCALE, sy: FOCUS_SY });

// Timing, in frames at 30 fps
const INTRO = 24;
const FLY_IN = 30;
const HOLD = 42;
const MOVE = 20;
const FLY_OUT = 30;
const holdStart = (i: number) => INTRO + FLY_IN + i * (HOLD + MOVE);
const END_OF_STOPS = holdStart(STOPS.length - 1) + HOLD;
export const APPS_TOUR_DURATION = END_OF_STOPS + FLY_OUT + 50;

type Segment = { from: number; to: number; a: Cam; b: Cam; dip: boolean };
const SEGMENTS: Segment[] = [
  { from: 0, to: INTRO, a: OVERVIEW_START, b: OVERVIEW_START, dip: false },
  { from: INTRO, to: INTRO + FLY_IN, a: OVERVIEW_START, b: at(STOPS[0]), dip: false },
  ...STOPS.flatMap((stop, i) => {
    const hold: Segment = { from: holdStart(i), to: holdStart(i) + HOLD, a: at(stop), b: at(stop), dip: false };
    if (i === STOPS.length - 1) return [hold];
    const move: Segment = { from: holdStart(i) + HOLD, to: holdStart(i + 1), a: at(stop), b: at(STOPS[i + 1]), dip: true };
    return [hold, move];
  }),
  { from: END_OF_STOPS, to: END_OF_STOPS + FLY_OUT, a: at(STOPS[STOPS.length - 1]), b: OVERVIEW_END, dip: false },
  { from: END_OF_STOPS + FLY_OUT, to: 100000, a: OVERVIEW_END, b: OVERVIEW_END, dip: false },
];

const camera = (frame: number): Cam => {
  const seg = SEGMENTS.find((s) => frame >= s.from && frame < s.to) ?? SEGMENTS[SEGMENTS.length - 1];
  const p = ease.inOut(Math.min(1, Math.max(0, (frame - seg.from) / (seg.to - seg.from))));
  const mix = (a: number, b: number) => a + (b - a) * p;
  // Between neighbours the camera eases back a little, like a dolly lifting over the wall
  const lift = seg.dip ? 1 - 0.18 * Math.sin(Math.PI * p) : 1;
  // Scale changes multiplicatively, so a zoom feels even all the way through
  const s = Math.exp(mix(Math.log(seg.a.s), Math.log(seg.b.s))) * lift;
  return { x: mix(seg.a.x, seg.b.x), y: mix(seg.a.y, seg.b.y), s, sy: mix(seg.a.sy, seg.b.sy) };
};

/** The name and line under the window in focus */
const Caption: React.FC<{ stop: Stop; index: number }> = ({ stop, index }) => {
  const frame = useCurrentFrame();
  const start = holdStart(index);
  const show = interpolate(frame, [start - 8, start + 8, start + HOLD - 2, start + HOLD + 8], [0, 1, 1, 0], clamp);
  if (show === 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 92, opacity: show }}>
      <Words text={stop.name} at={start - 8} stagger={3} rise={14} style={{ ...headline, fontSize: 76 }} />
      <Words
        text={stop.line}
        at={start - 2}
        stagger={2}
        rise={14}
        style={{ fontFamily: manrope, fontWeight: 600, fontSize: 40, color: color.muted, marginTop: 12, letterSpacing: "-0.01em" }}
      />
    </AbsoluteFill>
  );
};

const AppsTourInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = camera(frame);
  // 0 at the overview, 1 when a window fills the frame
  const zoom = interpolate(cam.s, [OVERVIEW_START.s, FOCUS_SCALE], [0, 1], clamp);
  // How far the picture moves this frame, in screen pixels: fast moves blur slightly, held shots stay sharp
  const prev = camera(Math.max(0, frame - 1));
  const speed = Math.hypot((cam.x - prev.x) * cam.s, (cam.y - prev.y) * cam.s) + Math.abs(cam.s - prev.s) * 2000;
  const blur = interpolate(speed, [12, 70], [0, 2.5], clamp);

  return (
    <>
      <Backdrop wallpaper="celestial" />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${960 - cam.x * cam.s}px, ${cam.sy - cam.y * cam.s}px) scale(${cam.s})`,
          filter: blur > 0 ? `blur(${blur / cam.s}px)` : undefined,
        }}
      >
        {STOPS.map((stop, i) => {
          const c = centre(stop);
          const distance = Math.hypot(c.x - cam.x, c.y - cam.y);
          const near = interpolate(distance, [0, 1500], [1, 0], clamp);
          // Windows pop onto the wall one after another at the start
          const pop = interpolate(frame, [i * 3, i * 3 + 16], [0, 1], { ...clamp, easing: ease.out });
          return (
            <div
              key={stop.screen}
              style={{
                position: "absolute",
                left: stop.col * (W + GAP),
                top: stop.row * (H + GAP),
                opacity: pop,
                scale: interpolate(pop, [0, 1], [0.92, 1]),
                filter: `brightness(${1 - zoom * 0.55 * (1 - near)})`,
              }}
            >
              <Screen name={stop.screen} width={W} />
            </div>
          );
        })}
      </div>

      {/* Darkens the bottom while zoomed in, so the caption reads over the row below */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, transparent 62%, rgba(5, 8, 14, 0.88) 84%, rgba(5, 8, 14, 0.95) 100%)",
          opacity: zoom,
        }}
      />

      {STOPS.map((stop, i) => (
        <Caption key={stop.screen} stop={stop} index={i} />
      ))}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <Words
          text="Everything you SSH in for,"
          at={END_OF_STOPS + 0.4 * fps}
          stagger={4}
          rise={18}
          style={{ ...headline, fontSize: 88, textAlign: "center" }}
        />
        <Words
          text="already open."
          at={END_OF_STOPS + 0.65 * fps}
          stagger={4}
          rise={18}
          style={{ ...headline, fontSize: 88, textAlign: "center" }}
        />
      </AbsoluteFill>
    </>
  );
};

export const AppsTour = Interactive.create({ Component: AppsTourInner, layout: "absolute-fill" });
