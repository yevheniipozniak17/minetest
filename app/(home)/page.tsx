import Benefits from './_sections/Benefits/Benefits';
import CommunityTrust from './_sections/CommunityTrust/CommunityTrust';
import Features from './_sections/Features/Features';

import { Hero } from './_sections/Hero/Hero';
import Preview from './_sections/Preview/Preview';
import Questions from './_sections/Questions/Questions';
import Rate from './_sections/Rate/Rate';

import Server from './_sections/Server/Server';
import StartAdventure from './_sections/StartAdventure/StartAdventure';

export default function Home() {
  return (
    <>
      <Hero />
      <Server />
      <Features />
      <Preview />
      <Benefits />
      <Rate />
      <CommunityTrust />
      <Questions />
      <StartAdventure />
    </>
  );
}
