import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Studio | Imponix Game Studio",
  description: "Imponix is a two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil.",
};

export default function StudioPage() {
  return (
    <div className="site-shell studio-page">
      <SiteHeader />
      <main>
        <section className="simple-hero page-width">
          <p className="eyebrow eyebrow--blue">Imponix Game Studio</p>
          <h1>Small team.<br />Personal games.</h1>
          <p>
            We are two friends—one in Montréal, Québec, Canada, and the other
            in Fortaleza, Ceará, Brazil—working together to make the kinds of
            games we want to play: focused worlds with distinct identities,
            memorable systems, and plenty of heart.
          </p>
        </section>

        <section className="studio-story page-width">
          <div className="studio-story__logo">
            <Image src="/brand/imponix-mark.png" alt="Imponix pixel mark" width={283} height={283} />
          </div>
          <div className="studio-story__copy">
            <p className="eyebrow">About us</p>
            <h2>Two friends, one studio, every hat.</h2>
            <p>
              Imponix is an independent developer and publisher. Being a team
              of two means staying close to every decision: code, design,
              story, sound, community, and the thousands of small choices that
              turn an idea into a game.
            </p>
            <p>
              Our first release, Veil of Shadows, explored a mysterious action
              adventure. Game Store Chronicle takes us somewhere completely
              different: a management simulation built around the history of
              gaming itself.
            </p>
          </div>
        </section>

        <section className="studio-principles">
          <div className="page-width">
            <p className="eyebrow eyebrow--blue">How we work</p>
            <div className="principle-grid">
              <article><span>01</span><h3>Stay close</h3><p>The people making the game are the people listening to players.</p></article>
              <article><span>02</span><h3>Make it distinct</h3><p>Every project deserves its own voice, palette, rhythm, and reason to exist.</p></article>
              <article><span>03</span><h3>Keep learning</h3><p>Each release becomes experience we carry directly into the next world.</p></article>
            </div>
          </div>
        </section>

        <section className="contact-band page-width">
          <div>
            <p className="eyebrow">Say hello</p>
            <h2>Want to talk games?</h2>
          </div>
          <a className="button button--light" href="mailto:contact@imponix.com">contact@imponix.com</a>
          <a className="text-link" href="/press">Press resources <ExternalLinkIcon /></a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
