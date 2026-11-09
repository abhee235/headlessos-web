// Scene 1. The old way: a wall of command output that scrolls faster and faster under "Stop reading
// output.", then collapses into a point of light that the logo grows out of.
// The host and address are documentation ranges (example.com, 192.0.2.0/24), never a real server. The
// 91%-full disk here is the one the AI scene explains later.
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Words } from "../components/Words";
import { clamp, color, ease, geistMono, headline } from "../theme";

const SESSION = [
  "$ ssh admin@web-01.example.com",
  "Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-48-generic x86_64)",
  "Last login: Sun Nov  8 22:41:07 2026 from 192.0.2.24",
  "$ uptime",
  " 10:42:19 up 6 days,  3:11,  1 user,  load average: 2.41, 2.18, 1.97",
  "$ df -h",
  "Filesystem      Size  Used Avail Use% Mounted on",
  "/dev/vda1        96G   87G  8.6G  91% /",
  "tmpfs           3.9G     0  3.9G   0% /dev/shm",
  "/dev/vda15      105M  6.1M   99M   6% /boot/efi",
  "$ free -m",
  "               total        used        free      shared  buff/cache   available",
  "Mem:            7952        6124         311         102        1516        1466",
  "Swap:           2047        1880         167",
  "$ docker ps -a",
  "CONTAINER ID   IMAGE         COMMAND                  STATUS                     NAMES",
  '4f2c1a9e7b31   nginx:1.27    "/docker-entrypoint.…"   Up 6 days                  web',
  '9a7e2d01c4f8   postgres:16   "docker-entrypoint.s…"   Up 6 days (healthy)        db',
  'c31b77e0a2d5   redis:7       "docker-entrypoint.s…"   Exited (137) 2 hours ago   cache',
  "$ systemctl status nginx --no-pager",
  "● nginx.service - A high performance web server and a reverse proxy server",
  "     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)",
  "     Active: active (running) since Mon 2026-11-02 07:31:12 UTC; 6 days ago",
  "   Main PID: 812 (nginx)",
  "$ journalctl -u nginx -n 3 --no-pager",
  "Nov 09 10:39:51 web-01 nginx[812]: [error] upstream timed out (110: Connection timed out)",
  "Nov 09 10:40:02 web-01 nginx[812]: [warn] 1024 worker_connections are not enough",
  "Nov 09 10:41:17 web-01 nginx[812]: [error] connect() failed (111: Connection refused)",
  "$ sudo du -sh /var/lib/docker",
  "74G\t/var/lib/docker",
  "$ ps aux --sort=-%mem | head -3",
  "USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
  "postgres    1204  3.1 18.2 2318460 1481220 ?    Ssl  Nov02  41:07 postgres",
  "root         998  1.4  6.5 2101932  531204 ?    Ssl  Nov02  12:44 dockerd",
  "$ sudo ufw status",
  "Status: active",
  "To                         Action      From",
  "22/tcp                     ALLOW       Anywhere",
  "80,443/tcp                 ALLOW       Anywhere",
  "$ crontab -l",
  "0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1",
];

// Enough output to keep the screen full while it accelerates
const LINES = [...SESSION, ...SESSION, ...SESSION];
const LINE_HEIGHT = 38;

const lineColor = (line: string) => {
  if (line.startsWith("$")) return color.text;
  if (line.includes("91%") || line.includes("[error]") || line.includes("Exited")) return color.amber;
  return "rgba(196, 210, 218, 0.62)";
};

const WallOfTextInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Scrolls at 140 px/s and speeds up by 420 px/s every second
  const scroll = 140 * t + 210 * t * t;

  // Everything collapses into a point between these frames
  const collapse = interpolate(frame, [4.0 * fps, 5.0 * fps], [0, 1], { ...clamp, easing: ease.in });

  return (
    <>
      <Backdrop wallpaper="graphite" dim={0.55} />

      <AbsoluteFill
        style={{
          scale: interpolate(collapse, [0, 1], [1, 0.02]),
          opacity: interpolate(collapse, [0.7, 1], [1, 0], clamp),
          filter: `blur(${interpolate(collapse, [0, 1], [0, 18])}px) brightness(${interpolate(collapse, [0, 1], [1, 2.4])})`,
        }}
      >
        {/* The output, fading in at the bottom and out at the top */}
        <AbsoluteFill
          style={{
            padding: "0 150px",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          }}
        >
          <div
            style={{
              fontFamily: geistMono,
              fontSize: 24,
              lineHeight: `${LINE_HEIGHT}px`,
              whiteSpace: "pre",
              // Starts with the screen already full
              translate: `0 ${60 - scroll}px`,
            }}
          >
            {LINES.map((line, i) => (
              <div key={i} style={{ color: lineColor(line) }}>
                {line.startsWith("$") ? (
                  <>
                    <span style={{ color: color.cyan }}>$</span>
                    {line.slice(1)}
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
        </AbsoluteFill>

        {/* Behind the headline the output blurs and darkens, so the words read over it */}
        <AbsoluteFill
          style={{
            backdropFilter: "blur(9px)",
            maskImage: "radial-gradient(ellipse 60% 26% at 50% 50%, #000 45%, transparent 100%)",
            background: "radial-gradient(ellipse 60% 30% at 50% 50%, rgba(5, 7, 10, 0.9) 0%, rgba(5, 7, 10, 0.7) 50%, transparent 100%)",
            opacity: interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], clamp),
          }}
        />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Words
            text="Stop reading output."
            at={0.6 * fps}
            stagger={5}
            rise={20}
            style={{ ...headline, fontSize: 160, textAlign: "center", textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* The point of light the logo scene starts from */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffffff 0%, rgba(160, 230, 255, 0.9) 22%, rgba(124, 58, 237, 0.35) 55%, transparent 72%)",
            opacity: interpolate(frame, [4.55 * fps, 5.0 * fps], [0, 1], clamp),
            scale: interpolate(frame, [4.55 * fps, 5.5 * fps], [0.2, 1], { ...clamp, easing: ease.out }),
          }}
        />
      </AbsoluteFill>
    </>
  );
};

export const WallOfText = Interactive.create({ Component: WallOfTextInner, layout: "absolute-fill" });
