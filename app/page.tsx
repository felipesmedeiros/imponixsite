import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "Imponix Game Studio | Games made by two friends",
  description:
    "Imponix is a two-person independent game studio in Montreal, creators of Game Store Chronicle and Veil of Shadows.",
};

export default function Home() {
  return (
    <div className="site-shell home-shell">
      <SiteHeader />

      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__grid" aria-hidden="true" />
          <div className="home-hero__copy page-width">
            <p className="eyebrow eyebrow--blue">Independent games · Montreal</p>
            <h1 id="home-title">
              Two friends.
              <span>Worlds worth remembering.</span>
            </h1>
            <p className="home-hero__lede">
              We are Imponix, a two-person game studio creating characterful
              worlds inspired by the games, stories, and eras we love.
            </p>
            <div className="button-row">
              <a className="button button--light" href="#games">
                Explore our games
              </a>
              <Link className="text-link" href="/studio">
                Meet the studio <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="home-hero__signal" aria-hidden="true">
            <span>IMX</span>
            <i />
            <small>02 people / 02 worlds</small>
          </div>
        </section>

        <section className="games-index page-width" id="games" aria-labelledby="games-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Our games</p>
              <h2 id="games-title">Pick a world.</h2>
            </div>
            <p>
              Different genres, one shared obsession: making games with a
              strong point of view.
            </p>
          </div>

          <article className="game-portal game-portal--gsc">
            <div className="game-portal__copy">
              <p className="game-portal__number">01 / Simulation</p>
              <div className="gsc-wordmark" aria-label="Game Store Chronicle">
                <span>GAME STORE</span>
                <small>CHRONICLE</small>
              </div>
              <p className="game-portal__tagline">It is not just a simulator. It is playable history.</p>
              <p className="game-portal__description">
                Read the market, stock the right products, set your prices,
                and grow a small game shop through the changing eras of gaming.
              </p>
              <div className="button-row">
                <Link className="button button--ink" href="/games/game-store-chronicle">
                  Enter the store
                </Link>
                <a
                  className="text-link text-link--ink"
                  href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy on Steam <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="gsc-portal-art" role="img" aria-label="Stylized placeholder for Game Store Chronicle artwork">
              <div className="gsc-portal-art__sun" />
              <div className="gsc-portal-art__sign">OPEN</div>
              <div className="gsc-portal-art__shelf gsc-portal-art__shelf--one" />
              <div className="gsc-portal-art__shelf gsc-portal-art__shelf--two" />
              <div className="gsc-portal-art__counter" />
              <span className="placeholder-tag">Key art placeholder</span>
            </div>
          </article>

          <article className="game-portal game-portal--vos">
            <div className="game-portal__copy">
              <p className="game-portal__number">02 / Action adventure</p>
              <div className="vos-wordmark" aria-label="Veil of Shadows">
                <span>VEIL OF</span>
                <strong>SHADOWS</strong>
              </div>
              <p className="game-portal__tagline">Some memories refuse to stay buried.</p>
              <p className="game-portal__description">
                Guide Sirene through a fractured forest, recover what she has
                forgotten, and survive the shadows closing in around her.
              </p>
              <div className="button-row">
                <Link className="button button--bone" href="/games/veil-of-shadows">
                  Enter the forest
                </Link>
                <a
                  className="text-link text-link--bone"
                  href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy on Steam <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="vos-portal-art" role="img" aria-label="Stylized placeholder for Veil of Shadows artwork">
              <div className="vos-portal-art__moon" />
              <div className="vos-portal-art__tree vos-portal-art__tree--left" />
              <div className="vos-portal-art__tree vos-portal-art__tree--right" />
              <div className="vos-portal-art__figure" />
              <span className="placeholder-tag">Key art placeholder</span>
            </div>
          </article>
        </section>

        <section className="studio-note">
          <div className="page-width studio-note__inner">
            <div className="studio-note__mark" aria-hidden="true">2</div>
            <div>
              <p className="eyebrow eyebrow--blue">Small by design</p>
              <h2>Two friends, making the games we want to play.</h2>
            </div>
            <Link className="button button--outline" href="/studio">
              About Imponix
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
