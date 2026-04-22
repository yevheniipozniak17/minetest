import Features from './components/Features/Features';
import { Hero } from './components/Hero/Hero';
import Preview from './components/Preview/Preview';
import Server from './components/Server/Server';
import StartAdventure from './components/StartAdventure/StartAdventure';

export default function Home() {
  return (
    <>
      <Hero />
      <Server />
      <Features />
      <Preview />
      <StartAdventure />
    </>
  );
}
