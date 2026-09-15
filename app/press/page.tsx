import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { T } from "../components/LanguageProvider";
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
    image: "/games/gsc/feature.jpg",
    imageAlt: "An Ultravision console and joystick displayed inside Game Store Chronicle",
    href: "https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle",
  },
  {
    number: "02",
    title: "Veil of Shadows",
    type: "Action-adventure / Roguelite",
    status: "Released September 12, 2024",
    className: "press-card--vos",
    image: "/games/vos/hero.jpg",
    imageAlt: "Sirene drawing her bow in the forest in Veil of Shadows",
    href: "https://impress.games/press-kit/imponix-game-studio/veil-of-shadows",
  },
];

export default function PressPage() {
  return (
    <div className="site-shell press-page">
      <SiteHeader />
      <main>
        <section className="simple-hero page-width">
          <p className="eyebrow eyebrow--blue"><T>Press & creators</T></p>
          <h1><T>Everything you need</T><br /><T>to tell the story.</T></h1>
          <p>
            <T>Official factsheets, descriptions, logos, screenshots, and trailers for Imponix games.</T>
          </p>
        </section>

        <section className="press-grid page-width" aria-label="Game press kits">
          {pressKits.map((kit) => (
            <a className={`press-card ${kit.className}`} href={kit.href} target="_blank" rel="noreferrer" key={kit.title}>
              <div className="press-card__media">
                <Image
                  src={kit.image}
                  alt={kit.imageAlt}
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <span className="press-card__number">{kit.number}</span>
              <div className="press-card__copy">
                <small><T>{kit.type}</T></small>
                <h2>{kit.title}</h2>
                <p><T>{kit.status}</T></p>
              </div>
              <ExternalLinkIcon />
            </a>
          ))}
        </section>

        <section className="press-contact page-width">
          <div>
            <p className="eyebrow"><T>Contact</T></p>
            <h2><T>Need something specific?</T></h2>
            <p><T>For interviews, review requests, or additional materials, get in touch directly.</T></p>
          </div>
          <a className="button button--light" href="mailto:contact@imponix.com">contact@imponix.com</a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
