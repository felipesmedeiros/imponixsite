import type { Metadata } from "next";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Journal | Imponix Game Studio",
  description:
    "Notes from Imponix about making, supporting, and learning from independent games.",
};

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
            <div className="journal-card__signal" aria-hidden="true">01</div>
            <div className="journal-card__copy">
              <p className="eyebrow eyebrow--blue">Studio note · August 21, 2026</p>
              <h2>A review is a signal, not a favor.</h2>
              <p>
                Why honest Steam reviews matter to a two-person studio—and what
                Steam actually says about scores, visibility, and feedback.
              </p>
              <a className="text-link" href="/journal/why-steam-reviews-matter">
                Read the note <ExternalLinkIcon />
              </a>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
