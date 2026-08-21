import type { Metadata } from "next";
import { headers } from "next/headers";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

const postTitle = "A review is a signal, not a favor. | Imponix Journal";
const postDescription =
  "Why honest Steam reviews matter to a two-person studio, what Steam actually says about visibility, and how players can help without pressure.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "imponix.com";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const socialImage = new URL("/og.png", `${protocol}://${host}`).toString();

  return {
    title: postTitle,
    description: postDescription,
    openGraph: {
      type: "article",
      title: postTitle,
      description: postDescription,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description: postDescription,
      images: [socialImage],
    },
  };
}

const steamReviewsUrl =
  "https://partner.steamgames.com/doc/store/reviews";
const steamVisibilityUrl =
  "https://partner.steamgames.com/doc/marketing/visibility?language=english";

export default function WhySteamReviewsMatterPage() {
  return (
    <div className="site-shell journal-page journal-article-page">
      <SiteHeader />
      <main>
        <header className="journal-article-hero">
          <div className="page-width">
            <a className="journal-article__back" href="/journal">
              <span aria-hidden="true">←</span> Imponix Journal
            </a>
            <p className="eyebrow eyebrow--blue">Studio note · August 21, 2026</p>
            <h1>A review is a signal, not a favor.</h1>
            <p className="journal-article__intro">
              Why honest Steam reviews matter to a two-person studio—and what
              the platform actually says about scores, visibility, and feedback.
            </p>
          </div>
        </header>

        <div className="journal-article-layout page-width">
          <aside className="journal-article-toc">
            <p>In this note</p>
            <nav aria-label="Journal sections">
              <a href="#short-version"><span>01</span>The short version</a>
              <a href="#steam-says"><span>02</span>What Steam actually says</a>
              <a href="#thresholds"><span>03</span>The thresholds people talk about</a>
              <a href="#why-it-helps"><span>04</span>Why each review helps</a>
              <a href="#what-we-ask"><span>05</span>What we ask</a>
            </nav>
          </aside>

          <article className="journal-article-body">
            <section id="short-version">
              <span className="journal-article-body__index">01</span>
              <h2>A small sentence can travel a long way.</h2>
              <p>
                For a small studio, a Steam review is more than a star or a
                percentage. It is a public account of what it felt like to play
                something we made. It helps a stranger decide whether a game
                is for them, and it tells us which parts of the experience are
                landing—or missing.
              </p>
              <p>
                We are two friends working between Montréal and Fortaleza. We
                do not have a giant marketing department or a wall of people
                watching every signal. Reviews are one of the clearest ways a
                player can tell us, and another player, what the game meant to
                them.
              </p>
            </section>

            <section id="steam-says">
              <span className="journal-article-body__index">02</span>
              <h2>What Steam actually says.</h2>
              <p>
                Steam does not publish a magic number of reviews that unlocks
                visibility. Its own documentation is more useful—and more
                measured—than the myths that circulate online.
              </p>
              <ul>
                <li><span><strong>Players need playtime to write a review.</strong> A purchase is not required to post one, but only reviews from accounts that purchased on Steam and played count toward the review score.</span></li>
                <li><span><strong>The store shows two scores.</strong> Steam displays a recent score based on the last 30 days and a lifetime score.</span></li>
                <li><span><strong>Forty percent is the published visibility line.</strong> Steam says that when a game is Mixed or above—40% or more—the review score is not a factor in algorithmic visibility. Below 40%, a game is less likely to be featured.</span></li>
                <li><span><strong>Helpful and recent reviews get attention.</strong> Steam says the reviews shown most prominently are selected from recently written, helpful reviews, while older reviews phase out over time.</span></li>
              </ul>
              <p className="journal-source-note">
                Read the full <a href={steamReviewsUrl} target="_blank" rel="noreferrer">Steam User Reviews documentation <ExternalLinkIcon /></a> and <a href={steamVisibilityUrl} target="_blank" rel="noreferrer">Visibility on Steam guidance <ExternalLinkIcon /></a>.
              </p>
            </section>

            <section id="thresholds">
              <span className="journal-article-body__index">03</span>
              <h2>So what about the “thresholds”?</h2>
              <p>
                You may hear people say that a game needs 10, 50, or 100
                reviews before Steam will take notice. Those numbers can be
                useful milestones for a team planning its launch, but they are
                not guaranteed Valve rules or visibility switches.
              </p>
              <div className="journal-threshold-grid">
                <div><strong>10</strong><span>First proof of life</span><p>A handful of honest voices makes a new store page feel less empty.</p></div>
                <div><strong>50</strong><span>More context</span><p>A broader sample starts to show patterns instead of one-off reactions.</p></div>
                <div><strong>100</strong><span>No magic unlock</span><p>A milestone can be encouraging, but Steam does not promise a visibility boost at this count.</p></div>
              </div>
              <p>
                The practical threshold is not “get enough people to say yes.”
                It is “make a game that players can understand, enjoy, and
                describe honestly.” The score, the written context, the helpful
                votes, and the way the game keeps improving all tell a richer
                story together.
              </p>
            </section>

            <section id="why-it-helps">
              <span className="journal-article-body__index">04</span>
              <h2>Why each review helps Imponix.</h2>
              <ul>
                <li><span><strong>Discovery.</strong> Reviews add language that helps the right players understand what kind of game they are looking at.</span></li>
                <li><span><strong>Trust.</strong> A store page feels more legible when players can see experiences from people who have actually played.</span></li>
                <li><span><strong>Direction.</strong> Praise tells us what to protect. Criticism tells us where the next careful pass belongs.</span></li>
                <li><span><strong>Momentum.</strong> A thoughtful review can reach someone who would never have found a two-person studio otherwise.</span></li>
              </ul>
            </section>

            <section id="what-we-ask">
              <span className="journal-article-body__index">05</span>
              <h2>What we ask from players.</h2>
              <p>
                If you have played Game Store Chronicle or Veil of Shadows and
                feel like sharing your experience, we would be grateful. A
                short, honest review is perfect. Positive or negative, specific
                or simple, it is useful because it is yours.
              </p>
              <p>
                We will never trade a review for a key, DLC, money, or another
                reward. We will never ask you to pretend to love something you
                do not. Steam’s own rules prohibit artificial influence, and we
                want this conversation to stay genuine.
              </p>
              <div className="journal-article-actions">
                <a className="button button--light journal-review-link" href="https://store.steampowered.com/recommended/recommendgame/3463400" target="_blank" rel="noreferrer">
                  <span className="journal-review-link__logo-wrap journal-review-link__logo-wrap--gsc" aria-hidden="true">
                    <img className="journal-review-link__logo" src="/games/gsc/menu-logo.png" alt="" />
                  </span>
                  <span>Review GSC on Steam</span>
                  <ExternalLinkIcon />
                </a>
                <a className="button button--light journal-review-link" href="https://store.steampowered.com/recommended/recommendgame/2613120" target="_blank" rel="noreferrer">
                  <span className="journal-review-link__logo-wrap journal-review-link__logo-wrap--vos" aria-hidden="true">
                    <img className="journal-review-link__logo" src="/games/vos/menu-logo.png" alt="" />
                  </span>
                  <span>Review VoS on Steam</span>
                  <ExternalLinkIcon />
                </a>
              </div>
            </section>
          </article>
        </div>

        <section className="journal-article-footer">
          <div className="page-width">
            <p className="eyebrow eyebrow--blue">Back to the studio</p>
            <h2>More worlds are on the way.</h2>
            <a className="text-link" href="/studio">Meet Imponix <ExternalLinkIcon /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
