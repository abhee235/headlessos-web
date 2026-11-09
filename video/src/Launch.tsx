// The launch video: eight scenes in a row. Scene 1 cuts straight into scene 2, because scene 1 ends on
// the point of light that scene 2 begins with; the rest cross-fade.
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { APPS_TOUR_DURATION, AppsTour } from "./scenes/AppsTour";
import { AskAI } from "./scenes/AskAI";
import { DesktopFor } from "./scenes/DesktopFor";
import { Facts, FACTS_DURATION } from "./scenes/Facts";
import { HowItWorks } from "./scenes/HowItWorks";
import { LogoReveal } from "./scenes/LogoReveal";
import { Outro } from "./scenes/Outro";
import { WallOfText } from "./scenes/WallOfText";

export const SCENES = {
  wallOfText: 165,
  logoReveal: 140,
  desktopFor: 165,
  appsTour: APPS_TOUR_DURATION,
  howItWorks: 225,
  askAI: 285,
  facts: FACTS_DURATION,
  outro: 180,
};
const FADES = [18, 15, 15, 15, 12, 18];

export const LAUNCH_DURATION =
  Object.values(SCENES).reduce((sum, d) => sum + d, 0) - FADES.reduce((sum, d) => sum + d, 0);

export const Launch: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Wall of text" durationInFrames={SCENES.wallOfText}>
      <WallOfText />
    </TransitionSeries.Sequence>
    <TransitionSeries.Sequence name="Logo" durationInFrames={SCENES.logoReveal}>
      <LogoReveal />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
    <TransitionSeries.Sequence name="A desktop for your…" durationInFrames={SCENES.desktopFor}>
      <DesktopFor />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Apps tour" durationInFrames={SCENES.appsTour}>
      <AppsTour />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="How it works" durationInFrames={SCENES.howItWorks}>
      <HowItWorks />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Ask AI" durationInFrames={SCENES.askAI}>
      <AskAI />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
    <TransitionSeries.Sequence name="Facts" durationInFrames={SCENES.facts}>
      <Facts />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
    <TransitionSeries.Sequence name="Outro" durationInFrames={SCENES.outro}>
      <Outro />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
