import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { GameNewsSection } from "../../components/GameNewsSection";
import { T } from "../../components/LanguageProvider";
import { PlayerReviewsSection } from "../../components/PlayerReviewsSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SteamReviewCallout } from "../../components/SteamReviewCallout";

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

const veilPlayerReviews = [
  {
    author: "ParanoiD",
    quote:
      "The game brings back those classic retro vibes but mixes in some roguelite elements that keep things fresh.",
    href: "https://steamcommunity.com/profiles/76561197963350490/recommended/2613120/",
  },
  {
    author: "Adriano",
    quote:
      "It reminds me of old school games: difficult opponents, enchanting songs and beautiful character design.",
    href: "https://steamcommunity.com/profiles/76561198021218682/recommended/2613120/",
  },
  {
    author: "Trexem",
    quote: "Veil of Shadows is an action-adventure crafted with incredible passion and dedication.",
    href: "https://steamcommunity.com/profiles/76561198127595992/recommended/2613120/",
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
              <p className="eyebrow eyebrow--red"><T>Imponix Game 02 · Available now</T></p>
              <Image
                className="vos-official-logo vos-official-logo--hero"
                src="/games/vos/logo.png"
                alt="Veil of Shadows"
                width={1338}
                height={1000}
                priority
              />
              <h1><T>Some memories refuse to stay buried.</T></h1>
              <p className="game-hero__lede">
                <T>Sirene wakes in a forest with almost no memory of how she arrived. Recover the fragments, survive what follows, and find a way through the darkness.</T>
              </p>
              <div className="button-row">
                <a className="button button--bone" href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/" target="_blank" rel="noreferrer"><T>Buy on Steam</T></a>
                <a className="text-link text-link--bone" href="#journey"><T>Follow the trail ↓</T></a>
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
              <span className="vos-hero-visual__caption"><T>Remember · Evolve · Endure</T></span>
            </div>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--vos" aria-label="Veil of Shadows sections">
          <div className="page-width">
            <a href="#journey"><T>Story</T></a>
            <a href="#features"><T>Gameplay</T></a>
            <a href="#media"><T>Media</T></a>
            <a href="#reviews"><T>Reviews</T></a>
            <a href="#news"><T>News &amp; updates</T></a>
          </div>
        </nav>

        <SteamReviewCallout
          tone="vos"
          eyebrow="Made it back?"
          heading="Enjoyed the journey? Leave a mark beyond the veil."
          description="If Sirene’s story stayed with you, a short Steam review helps more players find their way into the forest."
          href="https://store.steampowered.com/recommended/recommendgame/2613120"
          buttonLabel="Review VoS on Steam"
        />

        <section className="veil-story page-width" id="journey">
          <figure className="veil-story__portrait">
            <Image
              src="/games/vos/media-sirene.jpg"
              alt="Sirene looking back through the forest"
              fill
              sizes="(max-width: 1000px) 100vw, 54vw"
            />
            <figcaption>
              <span>Sirene</span>
              <strong><T>The forest holds the answers.</T></strong>
            </figcaption>
          </figure>
          <div>
            <p className="eyebrow eyebrow--red"><T>The story</T></p>
            <h2><T>The forest remembers what Sirene cannot.</T></h2>
            <p>
              <T>Each map holds pieces of the mystery. Search beyond the obvious, take on the threats that pursue you, and decide how far you are willing to go to uncover the truth.</T>
            </p>
          </div>
        </section>

        <section className="veil-features" id="features" aria-labelledby="veil-features-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow eyebrow--red"><T>Your journey</T></p>
                <h2 id="veil-features-title"><T>Remember. Evolve. Endure.</T></h2>
              </div>
              <p><T>Build Sirene your way and make every return to the forest count.</T></p>
            </div>
            <div className="veil-feature-grid">
              {veilFeatures.map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3><T>{title}</T></h3>
                  <p><T>{text}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="attribute-section page-width">
          <div className="attribute-section__copy">
            <p className="eyebrow eyebrow--red"><T>Shape your playstyle</T></p>
            <h2><T>Every find changes the build.</T></h2>
            <p>
              <T>Compare damage, speed, distance, and special effects, then take the gear that fits how you want Sirene to survive.</T>
            </p>
          </div>
          <figure className="attribute-screenshot">
            <Image
              src="/games/vos/build-screen.jpg"
              alt="In-game comparison between an explosive arrow and an acid arrow"
              fill
              sizes="(max-width: 1000px) 100vw, 50vw"
            />
            <figcaption><T>Actual in-game equipment comparison</T></figcaption>
          </figure>
        </section>

        <section className="media-section media-section--vos page-width" id="media" aria-labelledby="vos-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow eyebrow--red"><T>Beyond the veil</T></p>
              <h2 id="vos-media-title"><T>The trail changes. The danger waits.</T></h2>
            </div>
            <p><T>Meet Sirene, confront what follows her, and recover the memories hidden beyond the veil.</T></p>
          </div>
          <div className="media-grid media-grid--vos">
            <figure className="vos-media-card vos-media-card--wide">
              <Image src="/games/vos/media-combat.jpg" alt="Sirene facing a skeleton in a volcanic cavern" fill sizes="(max-width: 760px) 100vw, 55vw" />
              <figcaption><span><T>Combat</T></span><strong><T>Face what waits in the dark</T></strong></figcaption>
            </figure>
            <figure className="vos-media-card">
              <Image src="/games/vos/media-memory.jpg" alt="A childhood memory returning to Sirene" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span><T>Story</T></span><strong><T>Pieces of memory</T></strong></figcaption>
            </figure>
            <figure className="vos-media-card">
              <Image src="/games/vos/media-sirene.jpg" alt="Sirene looking back in the forest" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span>Sirene</span><strong><T>A past worth fighting for</T></strong></figcaption>
            </figure>
          </div>
        </section>

        <PlayerReviewsSection
          gameName="Veil of Shadows"
          heading="Some journeys stay with you."
          intro="A few words from players who followed Sirene into the forest. Read the full reviews on Steam."
          tone="vos"
          reviews={veilPlayerReviews}
        />

        <GameNewsSection
          gameName="Veil of Shadows"
          heading="Follow what moves in the dark."
          tone="vos"
          slots={veilNewsSlots}
        />

        <section className="game-details game-details--vos">
          <div className="page-width game-details__inner">
            <div>
              <p className="eyebrow eyebrow--red"><T>Details</T></p>
              <h2><T>Enter the forest.</T></h2>
            </div>
            <dl>
              <div><dt><T>Release</T></dt><dd><T>September 12, 2024</T></dd></div>
              <div><dt><T>Genre</T></dt><dd><T>Action-adventure / Roguelite</T></dd></div>
              <div><dt><T>Platform</T></dt><dd><T>PC via Steam</T></dd></div>
              <div><dt><T>Players</T></dt><dd><T>Single-player</T></dd></div>
            </dl>
            <div className="button-stack">
              <a className="button button--bone" href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/" target="_blank" rel="noreferrer"><T>Buy on Steam</T></a>
              <a className="text-link text-link--bone" href="https://impress.games/press-kit/imponix-game-studio/veil-of-shadows" target="_blank" rel="noreferrer"><T>Open press kit</T> <ExternalLinkIcon /></a>
            </div>
          </div>
        </section>

        <nav className="next-game next-game--vos page-width" aria-label="More Imponix games">
          <span><T>Next world</T></span>
          <a href="/games/game-store-chronicle">Game Store Chronicle <b aria-hidden="true">→</b></a>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
