import Link from "next/link";

type NewsSlot = {
  category: string;
  title: string;
  description: string;
  href?: string;
  meta?: string;
};

type GameNewsSectionProps = {
  gameName: string;
  heading: string;
  tone: "gsc" | "vos";
  slots: NewsSlot[];
};

export function GameNewsSection({
  gameName,
  heading,
  tone,
  slots,
}: GameNewsSectionProps) {
  const hasPublishedPost = slots.some((slot) => slot.href);

  return (
    <section
      className={`game-news game-news--${tone}`}
      id="news"
      aria-labelledby={`${tone}-news-title`}
    >
      <div className="page-width">
        <div className="section-heading section-heading--split">
          <div>
            <p className={`eyebrow${tone === "vos" ? " eyebrow--red" : ""}`}>
              News &amp; updates
            </p>
            <h2 id={`${tone}-news-title`}>{heading}</h2>
          </div>
          <p>
            Announcements, development stories, and complete patch notes for {gameName}
            will live here.
          </p>
        </div>

        <div className="game-news__grid">
          {slots.map((slot, index) => (
            <article className="game-news__card" key={slot.title}>
              <div className="game-news__meta">
                <span>{slot.category}</span>
                <span>{slot.meta ?? `0${index + 1}`}</span>
              </div>
              <h3>{slot.title}</h3>
              <p>{slot.description}</p>
              {slot.href ? (
                <Link className="game-news__read" href={slot.href}>
                  Read full update <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="game-news__placeholder">Future post</span>
              )}
            </article>
          ))}
        </div>

        <p className="game-news__note">
          {hasPublishedPost
            ? "Published posts open as full articles. The remaining cards show future content types."
            : "These are content placeholders. Each card can become a full article when the first update is ready."}
        </p>
      </div>
    </section>
  );
}
