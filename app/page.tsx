import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "./components/ExternalLinkIcon";
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
              <a className="text-link" href="/studio">
                Meet the studio <ExternalLinkIcon />
              </a>
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
              <Image
                className="gsc-official-logo gsc-official-logo--portal"
                src="/games/gsc/logo.png"
                alt="Game Store Chronicle"
                width={1280}
                height={720}
              />
              <p className="game-portal__tagline">It is not just a simulator. It is playable history.</p>
              <p className="game-portal__description">
                Read the market, stock the right products, set your prices,
                and grow a small game shop through the changing eras of gaming.
              </p>
              <div className="button-row">
                <a className="button button--ink" href="/games/game-store-chronicle">
                  Enter the store
                </a>
                <a
                  className="text-link text-link--ink"
                  href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy on Steam <ExternalLinkIcon />
                </a>
              </div>
            </div>

            <div className="gsc-portal-art gsc-portal-art--official">
              <Image
                src="/games/gsc/feature.jpg"
                alt="An Ultravision console, joystick, cartridges, and boxed stock from Game Store Chronicle"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
              />
            </div>
          </article>

          <article className="game-portal game-portal--vos">
            <div className="game-portal__copy">
              <p className="game-portal__number">02 / Action adventure</p>
              <Image
                className="vos-official-logo vos-official-logo--portal"
                src="/games/vos/logo.png"
                alt="Veil of Shadows"
                width={1338}
                height={1000}
              />
              <p className="game-portal__tagline">Some memories refuse to stay buried.</p>
              <p className="game-portal__description">
                Guide Sirene through a fractured forest, recover what she has
                forgotten, and survive the shadows closing in around her.
              </p>
              <div className="button-row">
                <a className="button button--bone" href="/games/veil-of-shadows">
                  Enter the forest
                </a>
                <a
                  className="text-link text-link--bone"
                  href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy on Steam <ExternalLinkIcon />
                </a>
              </div>
            </div>

            <div className="vos-portal-art vos-portal-art--official">
              <Image
                src="/games/vos/hero.jpg"
                alt="Sirene drawing her bow in the forest, with her cat nearby"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
              />
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
            <a className="button button--outline" href="/studio">
              About Imponix
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
