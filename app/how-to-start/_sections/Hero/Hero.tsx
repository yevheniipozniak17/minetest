import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';
import Image from 'next/image';
// import step2Illustration from '@/public/how-to-start/stepper-1.webp';
import test1Image from '@/public/how-to-start/test1.png';
import test2Image from '@/public/how-to-start/test2.png';
import test3Image from '@/public/how-to-start/test3.png';
import test4Image from '@/public/how-to-start/test4.png';
import test5Image from '@/public/how-to-start/test5.png';
import test6Image from '@/public/how-to-start/test6.png';

export default function Hero() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.title}>How to Start</h1>
        </Container>
      </section>

      <Container>
        <div className={styles.stepper}>
          <ul className={styles.stepperList}>
            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                1
              </span>

              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>
                  Install Minecraft
                  <span className={styles.stepperVersion}>
                    <Image
                      src="/how-to-start/icons/game.svg"
                      alt="Minecraft version"
                      width={24}
                      height={24}
                    />
                    1.21.x
                  </span>
                </h3>
                <p className={styles.stepperDescription}>
                  a licensed version of Minecraft is required to play
                </p>
                <button className={styles.stepperButton}>Download now</button>
              </div>
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                2
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Create an Account</h3>
                <p className={styles.stepperDescription}>
                  To get started, you need to register on our project website. This account is
                  essential for accessing your personal dashboard, making purchases in our store,
                  and syncing with the server.
                </p>
                <button className={styles.stepperButton}>Sign Up</button>
              </div>
              <Image src={test1Image} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                3
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Log in to Dashboard</h3>
                <p className={styles.stepperDescription}>
                  In Step 2, you&apos;ll log into your user dashboard. This area offers various
                  features, including the ability to make purchases, view your order history, and
                  manage your account settings.
                </p>
                <button className={styles.stepperButton}>Go to Dashboard</button>
              </div>
              <Image src={test2Image} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                4
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Choose a Server</h3>
                <p className={styles.stepperDescription}>
                  Welcome to Step 2! Here’s how it works: Our project features three unique servers,
                  each with its own rules and gameplay style. You can explore them through the
                  following links: <br /> <br /> - LuckySurvival <br /> - MineWars <br /> - CalmSky
                  <br /> <br /> Dive in and choose the server that suits your gaming style!
                </p>
              </div>
              <Image src={test3Image} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                5
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Connect to the Server</h3>
                <p className={styles.stepperDescription}>
                  To begin, launch Minecraft and navigate to the Multiplayer section. Here, you can
                  add the server&apos;s IP address, which you can find on the server&apos;s page.
                  This will allow you to connect and start playing with others!
                </p>
                <button className={styles.stepperButton}>View server details</button>
              </div>
              <Image src={test4Image} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                6
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Start Playing</h3>
                <p className={styles.stepperDescription}>
                  Now that you&apos;re ready to play, it&apos;s time to register on our project
                  website. This account will grant you access to your personal dashboard, allow you
                  to make purchases in our store, and keep everything synced with the server. Get
                  ready for an engaging experience with development, economy, and player
                  interactions!
                </p>
                <button className={styles.stepperButton}>Start playing now</button>
              </div>
              <Image src={test5Image} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                7
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Upgrade Your Experience </h3>
                <p className={styles.stepperDescription}>
                  Once you&apos;re registered on our project website, you&apos;ll unlock access to
                  your personal dashboard. This account allows you to shop in our store anytime and
                  enjoy permanent privileges with your purchases.
                </p>
                <button className={styles.stepperButton}>Open Store</button>
              </div>
              <Image src={test6Image} alt="" className={styles.stepperImage} />
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
