import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { GameNewsSection } from "../../components/GameNewsSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Veil of Shadows | Imponix Game Studio",
  description:
    "Guide Sirene through a fractured forest in an action-adventure with roguelite elements, memory fragments, side quests, and relentless shadows.",
};

const veilFeatures = [
  ["Memory fragments", "Recover pieces of Sirene's past and move closer to the truth behind the forest."],
  ["Your build", "Shape damage, agility, and accuracy, then unlock perks that change how you face each map."],
  ["Enemy events", "Survive shifting waves of enemies when the Black Shadows close in—and claim the reward."],
  ["Hidden paths", "Take on optional side quests, discover unusual rewards, and choose how deeply to explore."],
];

const veilNewsSlots = [
  {
    category: "Announcement",
    title: "News from beyond the veil",
    description: "Share release news, milestones, events, and important community announcements.",
  },
  {
    category: "Patch notes",
    title: "Changes in the shadows",
    description: "Publish combat tuning, fixes, quality-of-life improvements, and known issues.",
  },
  {
    category: "Developer diary",
    title: "Stories from the forest",
    description: "Take players inside the art, systems, and ideas behind Sirene's journey.",
  },
];

export default function VeilOfShadowsPage() {
  return (
    <div className="site-shell vos-page">
      <SiteHeader />
      <main>
        <section className="game-hero game-hero--vos">
          <div className="vos-stars" aria-hidden="true" />
          <div className="game-hero__copy page-width">
            <div>
              <p className="eyebrow eyebrow--red">Imponix Game 02 · Available now</p>
              <Image
                className="vos-official-logo vos-official-logo--hero"
                src="/games/vos/logo.png"
                alt="Veil of Shadows"
                width={1338}
                height={1000}
                priority
              />
              <h1>Some memories refuse to stay buried.</h1>
              <p className="game-hero__lede">
                Sirene wakes in a forest with almost no memory of how she
                arrived. Recover the fragments, survive what follows, and find
                a way through the darkness.
              </p>
              <div className="button-row">
                <a className="button button--bone" href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/" target="_blank" rel="noreferrer">Buy on Steam</a>
                <a className="text-link text-link--bone" href="#journey">Follow the trail ↓</a>
              </div>
            </div>

            <div className="vos-hero-visual vos-hero-visual--official">
              <Image
                className="vos-hero-visual__scene"
                src="/games/vos/hero.jpg"
                alt="Sirene drawing her bow beside her cat in a forest"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
                priority
              />
              <Image
                className="vos-hero-visual__cover"
                src="/games/vos/cover.jpg"
                alt="Veil of Shadows cover art"
                width={600}
                height={900}
              />
              <span className="vos-hero-visual__caption">Remember · Evolve · Endure</span>
            </div>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--vos" aria-label="Veil of Shadows sections">
          <div className="page-width">
            <a href="#journey">Story</a>
            <a href="#features">Gameplay</a>
            <a href="#media">Media</a>
            <a href="#news">News &amp; updates</a>
          </div>
        </nav>

        <section className="veil-story page-width" id="journey">
          <figure className="veil-story__portrait" aria-hidden="true">
            <span className="veil-story__index">I</span>
            <Image src="/games/vos/story.png" alt="" fill sizes="(max-width: 760px) 90vw, 34vw" />
          </figure>
          <div>
            <p className="eyebrow eyebrow--red">The story</p>
            <h2>The forest remembers what Sirene cannot.</h2>
            <p>
              Each map holds pieces of the mystery. Search beyond the obvious,
              take on the threats that pursue you, and decide how far you are
              willing to go to uncover the truth.
            </p>
          </div>
        </section>

        <section className="veil-features" id="features" aria-labelledby="veil-features-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow eyebrow--red">Your journey</p>
                <h2 id="veil-features-title">Remember. Evolve. Endure.</h2>
              </div>
              <p>Build Sirene your way and make every return to the forest count.</p>
            </div>
            <div className="veil-feature-grid">
              {veilFeatures.map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="attribute-section page-width">
          <div className="attribute-section__copy">
            <p className="eyebrow eyebrow--red">Shape your playstyle</p>
            <h2>Every find changes the build.</h2>
            <p>
              Compare damage, speed, distance, and special effects, then take
              the gear that fits how you want Sirene to survive.
            </p>
          </div>
          <figure className="attribute-screenshot">
            <Image
              src="/games/vos/build-screen.jpg"
              alt="In-game comparison between an explosive arrow and an acid arrow"
              fill
              sizes="(max-width: 1000px) 100vw, 50vw"
            />
            <figcaption>Actual in-game equipment comparison</figcaption>
          </figure>
        </section>

        <section className="media-section media-section--vos page-width" id="media" aria-labelledby="vos-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow eyebrow--red">Beyond the veil</p>
              <h2 id="vos-media-title">The trail changes. The danger waits.</h2>
            </div>
            <p>Meet Sirene, confront what follows her, and recover the memories hidden beyond the veil.</p>
          </div>
          <div className="media-grid media-grid--vos">
            <figure className="vos-media-card vos-media-card--wide">
              <Image src="/games/vos/media-combat.jpg" alt="Sirene facing a skeleton in a volcanic cavern" fill sizes="(max-width: 760px) 100vw, 55vw" />
              <figcaption><span>Combat</span><strong>Face what waits in the dark</strong></figcaption>
            </figure>
            <figure className="vos-media-card">
              <Image src="/games/vos/media-memory.jpg" alt="A childhood memory returning to Sirene" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span>Story</span><strong>Pieces of memory</strong></figcaption>
            </figure>
            <figure className="vos-media-card">
              <Image src="/games/vos/media-sirene.jpg" alt="Sirene looking back in the forest" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span>Sirene</span><strong>A past worth fighting for</strong></figcaption>
            </figure>
          </div>
        </section>

        <GameNewsSection
          gameName="Veil of Shadows"
          heading="Follow what moves in the dark."
          tone="vos"
          slots={veilNewsSlots}
        />

        <section className="game-details game-details--vos">
          <div className="page-width game-details__inner">
            <div>
              <p className="eyebrow eyebrow--red">Details</p>
              <h2>Enter the forest.</h2>
            </div>
            <dl>
              <div><dt>Release</dt><dd>September 12, 2024</dd></div>
              <div><dt>Genre</dt><dd>Action-adventure / Roguelite</dd></div>
              <div><dt>Platform</dt><dd>PC via Steam</dd></div>
              <div><dt>Players</dt><dd>Single-player</dd></div>
            </dl>
            <div className="button-stack">
              <a className="button button--bone" href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/" target="_blank" rel="noreferrer">Buy on Steam</a>
              <a className="text-link text-link--bone" href="https://impress.games/press-kit/imponix-game-studio/veil-of-shadows" target="_blank" rel="noreferrer">Open press kit <ExternalLinkIcon /></a>
            </div>
          </div>
        </section>

        <nav className="next-game next-game--vos page-width" aria-label="More Imponix games">
          <span>Next world</span>
          <Link href="/games/game-store-chronicle">Game Store Chronicle <b aria-hidden="true">→</b></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
