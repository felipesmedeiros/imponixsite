import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderFrame } from "../../components/PlaceholderFrame";
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
              <div className="vos-title" aria-label="Veil of Shadows">
                <span>VEIL OF</span>
                <strong>SHADOWS</strong>
              </div>
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

            <div className="vos-hero-visual" role="img" aria-label="Veil of Shadows hero artwork placeholder">
              <div className="vos-hero-visual__moon" />
              <div className="vos-hero-visual__ridge vos-hero-visual__ridge--back" />
              <div className="vos-hero-visual__ridge vos-hero-visual__ridge--front" />
              <div className="vos-hero-visual__sirene" />
              <div className="vos-hero-visual__shadow" />
              <span className="placeholder-tag">Hero art placeholder</span>
            </div>
          </div>
          <div className="whisper-line" aria-hidden="true">
            <span>Find the memories</span><i /><span>Face the shadows</span><i /><span>Choose your path</span>
          </div>
        </section>

        <section className="veil-story page-width" id="journey">
          <div className="veil-story__index">I</div>
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

        <section className="veil-features" aria-labelledby="veil-features-title">
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
            <h2>Three attributes. Your way through.</h2>
            <p>
              Invest experience across damage, agility, and accuracy. Every
              choice pushes Sirene toward a different kind of survivor.
            </p>
          </div>
          <div className="attribute-panel" aria-label="Example character attributes">
            <div><span>Damage</span><i style={{ "--value": "82%" } as React.CSSProperties} /></div>
            <div><span>Agility</span><i style={{ "--value": "64%" } as React.CSSProperties} /></div>
            <div><span>Accuracy</span><i style={{ "--value": "73%" } as React.CSSProperties} /></div>
            <small>Illustrative build · final game values vary</small>
          </div>
        </section>

        <section className="media-section media-section--vos page-width" aria-labelledby="vos-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow eyebrow--red">Beyond the veil</p>
              <h2 id="vos-media-title">The trail changes. The danger waits.</h2>
            </div>
            <p>Final screenshots and trailers will replace these frames.</p>
          </div>
          <div className="media-grid">
            <PlaceholderFrame eyebrow="Exploration" title="The fractured forest" tone="vos" />
            <PlaceholderFrame eyebrow="Combat" title="Enemy events" tone="vos" size="square" />
            <PlaceholderFrame eyebrow="Story" title="Pieces of memory" tone="vos" size="square" />
          </div>
        </section>

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
              <a className="text-link text-link--bone" href="https://impress.games/press-kit/imponix-game-studio/veil-of-shadows" target="_blank" rel="noreferrer">Open press kit ↗</a>
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
