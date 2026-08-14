import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Press | Imponix Game Studio",
  description: "Official press resources for Imponix Game Studio and its games.",
};

const pressKits = [
  {
    number: "01",
    title: "Game Store Chronicle",
    type: "Management simulation",
    status: "Released July 13, 2026",
    className: "press-card--gsc",
    href: "https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle",
  },
  {
    number: "02",
    title: "Veil of Shadows",
    type: "Action-adventure / Roguelite",
    status: "Released September 12, 2024",
    className: "press-card--vos",
    href: "https://impress.games/press-kit/imponix-game-studio/veil-of-shadows",
  },
];

export default function PressPage() {
  return (
    <div className="site-shell press-page">
      <SiteHeader />
      <main>
        <section className="simple-hero page-width">
          <p className="eyebrow eyebrow--blue">Press & creators</p>
          <h1>Everything you need<br />to tell the story.</h1>
          <p>
            Official factsheets, descriptions, logos, screenshots, and trailers
            for Imponix games.
          </p>
        </section>

        <section className="press-grid page-width" aria-label="Game press kits">
          {pressKits.map((kit) => (
            <a className={`press-card ${kit.className}`} href={kit.href} target="_blank" rel="noreferrer" key={kit.title}>
              <span>{kit.number}</span>
              <div>
                <small>{kit.type}</small>
                <h2>{kit.title}</h2>
                <p>{kit.status}</p>
              </div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </section>

        <section className="press-contact page-width">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Need something specific?</h2>
            <p>For interviews, review requests, or additional materials, get in touch directly.</p>
          </div>
          <a className="button button--light" href="mailto:contact@imponix.com">contact@imponix.com</a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
