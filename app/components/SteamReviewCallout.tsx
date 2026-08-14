import { ExternalLinkIcon } from "./ExternalLinkIcon";

type SteamReviewCalloutProps = {
  buttonLabel: string;
  description: string;
  eyebrow: string;
  heading: string;
  href: string;
  tone: "gsc" | "vos";
};

export function SteamReviewCallout({
  buttonLabel,
  description,
  eyebrow,
  heading,
  href,
  tone,
}: SteamReviewCalloutProps) {
  return (
    <aside
      className={`steam-review steam-review--${tone}`}
      aria-label="Steam review invitation"
    >
      <div className="page-width steam-review__inner">
        <span className="steam-review__mark" aria-hidden="true">
          ★
        </span>
        <div className="steam-review__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
        <a
          className="button steam-review__button"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {buttonLabel}
          <ExternalLinkIcon />
        </a>
      </div>
    </aside>
  );
}
