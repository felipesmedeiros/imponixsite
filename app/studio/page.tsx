import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { JsonLd } from "../components/JsonLd";
import { T } from "../components/LanguageProvider";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata, organizationJsonLd } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/studio",
  title: "About Imponix Game Studio | Montréal & Fortaleza",
  description:
    "Meet Imponix, a two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil.",
});

export default function StudioPage() {
  return (
    <div className="site-shell studio-page">
      <JsonLd data={organizationJsonLd} />
      <SiteHeader />
      <main>
        <section className="simple-hero page-width">
          <p className="eyebrow eyebrow--blue">Imponix Game Studio</p>
          <h1><T>Small team.</T><br /><T>Personal games.</T></h1>
          <p>
            <T>We are two friends—one in Montréal, Québec, Canada, and the other in Fortaleza, Ceará, Brazil—working together to make the kinds of games we want to play: focused worlds with distinct identities, memorable systems, and plenty of heart.</T>
          </p>
        </section>

        <section className="studio-story page-width">
          <div className="studio-story__logo">
            <Image src="/brand/imponix-mark.png" alt="Imponix pixel mark" width={283} height={283} />
          </div>
          <div className="studio-story__copy">
            <p className="eyebrow"><T>About us</T></p>
            <h2><T>Two friends, one studio, every hat.</T></h2>
            <p>
              <T>Imponix is an independent developer and publisher. Being a team of two means staying close to every decision: code, design, story, sound, community, and the thousands of small choices that turn an idea into a game.</T>
            </p>
            <p>
              <T>Our first release, Veil of Shadows, explored a mysterious action adventure. Game Store Chronicle takes us somewhere completely different: a management simulation built around the history of gaming itself.</T>
            </p>
          </div>
        </section>

        <section className="studio-principles">
          <div className="page-width">
            <p className="eyebrow eyebrow--blue"><T>How we work</T></p>
            <div className="principle-grid">
              <article><span>01</span><h3><T>Stay close</T></h3><p><T>The people making the game are the people listening to players.</T></p></article>
              <article><span>02</span><h3><T>Make it distinct</T></h3><p><T>Every project deserves its own voice, palette, rhythm, and reason to exist.</T></p></article>
              <article><span>03</span><h3><T>Keep learning</T></h3><p><T>Each release becomes experience we carry directly into the next world.</T></p></article>
            </div>
          </div>
        </section>

        <section className="contact-band page-width">
          <div>
            <p className="eyebrow"><T>Say hello</T></p>
            <h2><T>Want to talk games?</T></h2>
          </div>
          <a className="button button--light" href="mailto:contact@imponix.com">contact@imponix.com</a>
          <a className="text-link" href="/press"><T>Press resources</T> <ExternalLinkIcon /></a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
