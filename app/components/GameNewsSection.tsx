import { T } from "./LanguageProvider";

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
  const hasExternalPost = slots.some((slot) => slot.href?.startsWith("http"));
  const hasInternalPost = slots.some((slot) => slot.href && !slot.href.startsWith("http"));
  const sectionDescription = `The latest announcements, development stories, and patch notes for ${gameName}.`;
  const note = hasExternalPost && hasInternalPost
    ? "Studio posts open here; Steam announcements open in a new tab."
    : hasExternalPost
      ? "These posts open their original Steam announcements in a new tab."
      : hasPublishedPost
        ? "Published posts open as full articles. The remaining cards show future content types."
        : "These are content placeholders. Each card can become a full article when the first update is ready.";

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
              <T>News &amp; updates</T>
            </p>
            <h2 id={`${tone}-news-title`}><T>{heading}</T></h2>
          </div>
          <p><T>{sectionDescription}</T></p>
        </div>

        <div className="game-news__grid">
          {slots.map((slot, index) => (
            <article className="game-news__card" key={slot.title}>
              <div className="game-news__meta">
                <span><T>{slot.category}</T></span>
                <span><T>{slot.meta ?? `0${index + 1}`}</T></span>
              </div>
              <h3><T>{slot.title}</T></h3>
              <p><T>{slot.description}</T></p>
              {slot.href ? (
                <a
                  className="game-news__read"
                  href={slot.href}
                  target={slot.href.startsWith("http") ? "_blank" : undefined}
                  rel={slot.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <T>Read full update</T> <span aria-hidden="true">→</span>
                </a>
              ) : (
                <span className="game-news__placeholder"><T>Future post</T></span>
              )}
            </article>
          ))}
        </div>

        <p className="game-news__note">
          <T>{note}</T>
        </p>
      </div>
    </section>
  );
}
