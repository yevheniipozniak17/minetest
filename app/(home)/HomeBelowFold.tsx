import Benefits from './_sections/Benefits/Benefits';
import CommunityTrust from './_sections/CommunityTrust/CommunityTrust';
import Features from './_sections/Features/Features';
import HowItWorks from './_sections/HowItWorks/HowItWorks';
import Preview from './_sections/Preview/Preview';
import Questions from './_sections/Questions/Questions';
import StartAdventure from './_sections/StartAdventure/StartAdventure';

export default function HomeBelowFold({ isAuthed = false }: { isAuthed?: boolean }) {
  return (
    <>
      <Features />
      <Preview isAuthed={isAuthed} />
      <Benefits />
      <HowItWorks />
      <CommunityTrust />
      <Questions />
      <StartAdventure isAuthed={isAuthed} />
    </>
  );
}
