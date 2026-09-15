import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "./components/ExternalLinkIcon";
import { T } from "./components/LanguageProvider";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { SocialFeedSection } from "./components/SocialFeedSection";

export const metadata: Metadata = {
  title: "Imponix Game Studio | Games made by two friends",
  description:
    "Imponix is a two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil, creators of Game Store Chronicle and Veil of Shadows.",
};

export default function Home() {
  return (
    <div className="site-shell home-shell">
      <SiteHeader />

      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__grid" aria-hidden="true" />
          <div className="home-hero__copy page-width">
            <p className="eyebrow eyebrow--blue"><T>Independent games · Montréal + Fortaleza</T></p>
            <h1 id="home-title">
              <T>Two friends.</T>
              <span><T>Worlds worth remembering.</T></span>
            </h1>
            <p className="home-hero__lede">
              <T>We are Imponix, a two-person game studio creating characterful worlds inspired by the games, stories, and eras we love.</T>
            </p>
            <div className="button-row">
              <a className="button button--light" href="#games">
                <T>Explore our games</T>
              </a>
              <a className="text-link" href="/studio">
                <T>Meet the studio</T> <ExternalLinkIcon />
              </a>
            </div>
          </div>

          <div className="home-hero__signal" aria-hidden="true">
            <span>IMX</span>
            <i />
            <small><T>02 people / 02 worlds</T></small>
          </div>
        </section>

        <section className="games-index page-width" id="games" aria-labelledby="games-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow"><T>Our games</T></p>
              <h2 id="games-title"><T>Pick a world.</T></h2>
            </div>
            <p>
              <T>Different genres, one shared obsession: making games with a strong point of view.</T>
            </p>
          </div>

          <article className="game-portal game-portal--gsc">
            <div className="game-portal__copy">
              <p className="game-portal__number"><T>01 / Simulation</T></p>
              <Image
                className="gsc-official-logo gsc-official-logo--portal"
                src="/games/gsc/logo.png"
                alt="Game Store Chronicle"
                width={1280}
                height={720}
              />
              <p className="game-portal__tagline"><T>It is not just a simulator. It is playable history.</T></p>
              <p className="game-portal__description">
                <T>Read the market, stock the right products, set your prices, and grow a small game shop through the changing eras of gaming.</T>
              </p>
              <div className="button-row">
                <a className="button button--ink" href="/games/game-store-chronicle">
                  <T>Enter the store</T>
                </a>
                <a
                  className="text-link text-link--ink"
                  href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <T>Buy on Steam</T> <ExternalLinkIcon />
                </a>
                <a
                  className="text-link text-link--ink"
                  data-track-event="mod_tool_download"
                  href="https://downloads.imponix.com/GSC%20Mod%20Studio%20Setup%200.3.0.zip"
                  target="_blank"
                  rel="noreferrer"
                  title="Download GSC Mod Studio 0.3.0"
                >
                  <T>Mod Studio</T> <ExternalLinkIcon />
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

          <article className="game-portal game-portal--noema">
            <div className="game-portal__copy">
              <p className="game-portal__number"><T>02 / Experimental narrative</T></p>
              <Image
                className="noema-title-lockup noema-title-lockup--portal"
                src="/games/noema/library-logo.png"
                alt="NOEMA"
                width={800}
                height={720}
              />
              <p className="game-portal__tagline"><T>Routine becomes ritual. Pay attention.</T></p>
              <p className="game-portal__description">
                <T>Take your place at an unfamiliar terminal, decode the signals, and discover what the work is trying to hide.</T>
              </p>
              <div className="button-row">
                <a className="button noema-button" href="/games/noema">
                  <T>Enter the terminal</T>
                </a>
                {/* Restore when NOEMA's public Steam page is live.
                <a
                  className="text-link noema-text-link"
                  href="https://store.steampowered.com/app/5253880/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wishlist on Steam <ExternalLinkIcon />
                </a>
                */}
              </div>
            </div>

            <div className="noema-portal-art">
              <Image
                src="/games/noema/screenshot-terminal.png"
                alt="The NOEMA terminal displaying a signal-processing assignment"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
              />
            </div>
          </article>

          <article className="game-portal game-portal--vos">
            <div className="game-portal__copy">
              <p className="game-portal__number"><T>03 / Action adventure</T></p>
              <Image
                className="vos-official-logo vos-official-logo--portal"
                src="/games/vos/logo.png"
                alt="Veil of Shadows"
                width={1338}
                height={1000}
              />
              <p className="game-portal__tagline"><T>Some memories refuse to stay buried.</T></p>
              <p className="game-portal__description">
                <T>Guide Sirene through a fractured forest, recover what she has forgotten, and survive the shadows closing in around her.</T>
              </p>
              <div className="button-row">
                <a className="button button--bone" href="/games/veil-of-shadows">
                  <T>Enter the forest</T>
                </a>
                <a
                  className="text-link text-link--bone"
                  href="https://store.steampowered.com/app/2613120/Veil_of_Shadows/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <T>Buy on Steam</T> <ExternalLinkIcon />
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

        <SocialFeedSection />

        <section className="studio-note">
          <div className="page-width studio-note__inner">
            <div className="studio-note__mark" aria-hidden="true">2</div>
            <div>
              <p className="eyebrow eyebrow--blue"><T>Small by design</T></p>
              <h2><T>Two friends, making the games we want to play.</T></h2>
            </div>
            <a className="button button--outline" href="/studio">
              <T>About Imponix</T>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
