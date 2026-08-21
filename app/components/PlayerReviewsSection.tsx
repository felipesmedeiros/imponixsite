import { ExternalLinkIcon } from "./ExternalLinkIcon";

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
              From the players
            </p>
            <h2 id={`${tone}-reviews-title`}>{heading}</h2>
          </div>
          <p>{intro}</p>
        </div>

        <div className="player-reviews__grid">
          {reviews.map((review) => (
            <figure className="player-review-card" key={review.href}>
              <blockquote>“{review.quote}”</blockquote>
              <figcaption>
                <span>{review.author}</span>
                <small>Steam player review · {gameName}</small>
                <a href={review.href} target="_blank" rel="noreferrer">
                  Read on Steam <ExternalLinkIcon />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
