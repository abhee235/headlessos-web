import { Composition, Folder, Still } from "remotion";
import { Launch, LAUNCH_DURATION, SCENES } from "./Launch";
import { Thumbnail } from "./Thumbnail";
import { AppsTour } from "./scenes/AppsTour";
import { AskAI } from "./scenes/AskAI";
import { DesktopFor } from "./scenes/DesktopFor";
import { Facts } from "./scenes/Facts";
import { HowItWorks } from "./scenes/HowItWorks";
import { LogoReveal } from "./scenes/LogoReveal";
import { Outro } from "./scenes/Outro";
import { WallOfText } from "./scenes/WallOfText";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Launch" component={Launch} width={1920} height={1080} fps={30} durationInFrames={LAUNCH_DURATION} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
    <Folder name="Scenes">
      <Composition id="WallOfText" component={WallOfText} width={1920} height={1080} fps={30} durationInFrames={SCENES.wallOfText} />
      <Composition id="LogoReveal" component={LogoReveal} width={1920} height={1080} fps={30} durationInFrames={SCENES.logoReveal} />
      <Composition id="DesktopFor" component={DesktopFor} width={1920} height={1080} fps={30} durationInFrames={SCENES.desktopFor} />
      <Composition id="AppsTour" component={AppsTour} width={1920} height={1080} fps={30} durationInFrames={SCENES.appsTour} />
      <Composition id="HowItWorks" component={HowItWorks} width={1920} height={1080} fps={30} durationInFrames={SCENES.howItWorks} />
      <Composition id="AskAI" component={AskAI} width={1920} height={1080} fps={30} durationInFrames={SCENES.askAI} />
      <Composition id="Facts" component={Facts} width={1920} height={1080} fps={30} durationInFrames={SCENES.facts} />
      <Composition id="Outro" component={Outro} width={1920} height={1080} fps={30} durationInFrames={SCENES.outro} />
    </Folder>
  </>
);
