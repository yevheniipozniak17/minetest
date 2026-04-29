import Image from 'next/image';
import { Container } from '../../../_components/Container/Container';
import { Divider } from '../../../_components/Divider/Divider';
import CardList from './CardList/CardList';
import styles from './Server.module.css';

export default function Server() {
  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>Choose Your Server</h2>
          <p className={styles.description}>
            Each server offers a unique playstyle.
            <br />
            Join the world that fits you best.
          </p>
          <div className={styles.cards}>
            <CardList />
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statsCards}>
              <div className={styles.stats}>
                <h3 className={styles.statsTitle}>Live Server Stats</h3>
                <ul className={styles.statsList}>
                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>Total players online now</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      100+
                    </span>
                  </li>

                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>Servers online</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      3 / 3
                    </span>
                  </li>
                </ul>
              </div>
              <div className={styles.topPlayers}>
                <h3 className={styles.statsTitleWrapper}>
                  Top Players Today
                  <Image
                    src="/icons/illustrations/champ-cup.svg"
                    alt="Arrow up"
                    width={33}
                    height={36}
                  />
                </h3>

                <ul className={styles.statsList}>
                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>AlexPvP</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      4,520 pts
                    </span>
                  </li>

                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>SkyBuilder</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      3,980 pts
                    </span>
                  </li>

                  <li className={styles.statsItem}>
                    <p className={styles.statsItemText}>WarLord</p>
                    <span className={styles.statsBadge}>
                      <Image
                        className={styles.statsBadgeDot}
                        src="/icons/icons/ellipse.svg"
                        alt=""
                        width={7}
                        height={7}
                      />
                      3,740 pts
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.newPlayerBonus}>
              <h2 className={styles.newPlayerBonus_title}>New Player Bonus</h2>
              <p className={styles.newPlayerBonus_text}>Get 20% OFF your first purchase</p>
              <p className={styles.newPlayerBonus_description}>
                Boost your gameplay with in-game currency or privileges.
                <br />
                Limited-time offer for new players.
              </p>
              <button className={styles.newPlayerBonus_button}>Claim Bonus</button>
              <Image
                className={styles.newPlayerBonus_illustration}
                src="/icons/illustrations/server-illustration.png"
                alt=""
                width={475}
                height={243}
                aria-hidden="true"
              />
            </div>
          </div>
        </Container>
      </section>

      <Divider />
    </>
  );
}
