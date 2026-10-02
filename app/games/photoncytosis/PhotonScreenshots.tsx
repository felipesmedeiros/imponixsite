"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { T, useLanguage } from "../../components/LanguageProvider";

const screenshots = [
  {
    title: "Life on the desktop",
    alt: "Photoncytosis organisms highlighted on the Game Store Chronicle logo in a desktop window",
  },
  {
    title: "Under the microscope",
    alt: "Photoncytosis microscope showing a connected organism at eight times magnification beside the main controls",
  },
  {
    title: "Every cell has a story",
    alt: "Photoncytosis motor cell details with age, energy, and activity beside the microscope",
  },
  {
    title: "Choose an evolutionary path",
    alt: "Photoncytosis mutation tree showing feeding, energy, lifespan, movement, defense, and attack research",
  },
  {
    title: "A closer look at living cells",
    alt: "Two Photoncytosis organisms under the microscope over red and white desktop pixels",
  },
  {
    title: "Meet the specialized cells",
    alt: "Photoncytosis cell guide describing the attack cell alongside the microscope and organism status",
  },
] as const;

export function PhotonScreenshots() {
  const [selected, setSelected] = useState(1);
  const { t } = useLanguage();
  const screenshot = screenshots[selected];
  const source = `/games/photoncytosis/screenshot${selected + 1}.png`;

  return (
    <div className="photon-gallery">
      <figure className="photon-gallery__selected">
        <a href={source} target="_blank" rel="noreferrer" aria-label={`${t("Open full-size screenshot")}: ${t(screenshot.title)}`}>
          <Image src={source} alt={t(screenshot.alt)} width={2560} height={1440} sizes="(max-width: 1288px) calc(100vw - 48px), 1240px" unoptimized />
        </a>
        <figcaption>
          <span aria-live="polite"><T>{screenshot.title}</T></span>
          <a href={source} target="_blank" rel="noreferrer" title={t("Open full-size screenshot")} aria-label={t("Open full-size screenshot")}>
            <span aria-hidden="true">{String(selected + 1).padStart(2, "0")} / 06</span>
            <ExternalLinkIcon />
          </a>
        </figcaption>
      </figure>
      <div className="photon-gallery__thumbnails" role="group" aria-label={t("Gameplay screenshots")}>
        {screenshots.map((item, index) => (
          <button key={item.title} type="button" aria-pressed={selected === index} aria-label={t(item.title)} title={t(item.title)} onClick={() => setSelected(index)}>
            <Image src={`/games/photoncytosis/screenshot${index + 1}.png`} alt="" width={2560} height={1440} sizes="(max-width: 760px) 30vw, 190px" unoptimized />
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
