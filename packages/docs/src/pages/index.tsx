import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const features = [
  {
    title: 'Named Signals',
    description:
      'Every action has a name. Trace, compose, and extend with the command pipeline pattern.',
  },
  {
    title: 'First-class Async',
    description:
      'Signals return Promises. Async actions just work — no middleware required.',
  },
  {
    title: 'Server State',
    description:
      'TanStack Query and Apollo Client integrations. One interface for client and server state.',
  },
];

function HomepageHero() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          Signal-driven state management for React
        </p>
        <Link className={styles.heroButton} to="/docs/intro">
          Get Started
        </Link>
      </div>
    </header>
  );
}

function FeatureCard({title, description}: {title: string; description: string}) {
  return (
    <div className={styles.featureCard}>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Signal-driven state management"
      description="Sinux — signal-driven state management for React. Named signals, first-class async, server state integrations.">
      <HomepageHero />
      <main className={styles.features}>
        <div className={styles.featuresInner}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
