// The video's design tokens: the website's typefaces and brand colours, and one set of easings so every
// scene moves the same way.
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { Easing } from "remotion";

// Manrope is the site's text face, Geist its wordmark, Geist Mono its code
export const manrope = loadManrope("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] }).fontFamily;
export const geist = loadGeist("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
export const geistMono = loadGeistMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const color = {
  text: "#f3f6f8",
  muted: "#bdc8ce",
  faint: "#82929a",
  // The logo's gradient ends, and the site's "lit" violet
  cyan: "#00d4ff",
  violet: "#7c3aed",
  lilac: "#b9a2ff",
  pill: "linear-gradient(180deg, #8c72cf 0%, #7558bc 40%, #6a4fb0 75%, #583f98 100%)",
  amber: "#f5b44a",
  green: "#34c77b",
  // The light card the website uses for the AI example
  paper: "#f6f8f8",
  ink: "#10202a",
};

export const ease = {
  // Entrances settle softly; camera moves start and stop gently; exits leave quickly
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Headline type, matching the site's hero (weight 800, tight tracking)
export const headline = {
  fontFamily: manrope,
  fontWeight: 800,
  letterSpacing: "-0.045em",
  lineHeight: 1.02,
  color: color.text,
} as const;
