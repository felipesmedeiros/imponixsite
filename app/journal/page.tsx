import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/journal",
  title: "Imponix Journal | Independent Game Development",
  description:
    "Notes from Imponix about making, supporting, and learning from independent games.",
});

export default function JournalPage() {
  return (
    <div className="site-shell journal-page">
      <SiteHeader />
      <main>
        <section className="simple-hero page-width journal-hero">
          <p className="eyebrow eyebrow--blue">Imponix Journal</p>
          <h1>Notes from<br />the other side<br />of the screen.</h1>
          <p>
            A place for the ideas, lessons, and little stories that sit behind
            the games we make.
          </p>
        </section>

        <section className="journal-index page-width" aria-label="Journal posts">
          <article className="journal-card">
            <div className="journal-card__media">
              <Image
                src="/journal/noema-photoncytosis-demo-update-og.png"
                alt="NOEMA's green computer terminal beside Photoncytosis's branching pixel organism."
                width={1774}
                height={887}
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </div>
            <div className="journal-card__copy">
              <p className="eyebrow eyebrow--blue">Demo update / October 2, 2026</p>
              <h2>NOEMA is playable. Photoncytosis is next.</h2>
              <p>
                Play NOEMA&apos;s free demo on Steam now. Photoncytosis&apos;s demo
                is planned for October 2026, with both full games planned for Q1 2027.
              </p>
              <a className="text-link" href="/journal/noema-photoncytosis-demo-update">
                Read the note <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
          <article className="journal-card">
            <div className="journal-card__media">
              <Image
                src="/journal/steam-reviews-og.png"
                alt="A game shop and moonlit forest framing the headline A review is a signal, not a favor."
                width={1731}
                height={909}
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </div>
            <div className="journal-card__copy">
              <p className="eyebrow eyebrow--blue">Studio note · August 21, 2026</p>
              <h2>A review is a signal, not a favor.</h2>
              <p>
                Why honest Steam reviews matter to a two-person studio—and what
                Steam actually says about scores, visibility, and feedback.
              </p>
              <a className="text-link" href="/journal/why-steam-reviews-matter">
                Read the note <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
