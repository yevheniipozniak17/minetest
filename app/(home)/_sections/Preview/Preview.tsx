'use client';

import styles from './Preview.module.css';
import PreviewList from './PreviewList/PreviewList';
import { Divider } from '../../../_components/Divider/Divider';
import Tabs from '@/app/_components/Tabs/Tabs';

export type PreviewCardProps = {
  title: string;
  text: string;
  icon: string;
};

const Data: PreviewCardProps[] = [
  {
    title: '500 Crystals',
    text: 'Start your journey.',
    icon: '/icons/illustrations/preview-green.svg',
  },
  {
    title: '1,500 Crystals',
    text: 'Best value for active players.',
    icon: '/icons/illustrations/preview-yellow.svg',
  },
  {
    title: '5,000 Crystals',
    text: 'For serious progression.',
    icon: '/icons/illustrations/preview-blue.svg',
  },
];

export default function Preview() {
  return (
    <>
      <section className={styles.preview}>
        <h2 className={styles.title}>Store Preview</h2>

        <Tabs />

        <PreviewList items={Data} />
      </section>
      <Divider />
    </>
  );
}
