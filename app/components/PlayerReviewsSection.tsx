import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { T } from "./LanguageProvider";

type PlayerReview = {
  author: string;
  href: string;
  quote: string;
};

type PlayerReviewsSectionProps = {
  gameName: string;
  heading: string;
  intro: string;
  reviews: PlayerReview[];
  tone: "gsc" | "vos";
};

export function PlayerReviewsSection({
  gameName,
  heading,
  intro,
  reviews,
  tone,
}: PlayerReviewsSectionProps) {
  return (
    <section
      className={`player-reviews player-reviews--${tone}`}
      id="reviews"
      aria-labelledby={`${tone}-reviews-title`}
    >
      <div className="page-width">
        <div className="section-heading section-heading--split">
          <div>
            <p className={`eyebrow${tone === "vos" ? " eyebrow--red" : ""}`}>
              <T>From the players</T>
            </p>
            <h2 id={`${tone}-reviews-title`}><T>{heading}</T></h2>
          </div>
          <p><T>{intro}</T></p>
        </div>

        <div className="player-reviews__grid">
          {reviews.map((review) => (
            <figure className="player-review-card" key={review.href}>
              <blockquote>“{review.quote}”</blockquote>
              <figcaption>
                <span>{review.author}</span>
                <small><T>Steam player review</T> · {gameName}</small>
                <a href={review.href} target="_blank" rel="noreferrer">
                  <T>Read on Steam</T> <ExternalLinkIcon />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
