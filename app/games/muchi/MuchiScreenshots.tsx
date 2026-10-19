"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { T, useLanguage } from "../../components/LanguageProvider";

const screenshots = [
  { file: "007", title: "A little garden", alt: "Muchi beside a small garden of colourful flowers and a bee on a Windows desktop" },
  { file: "006", title: "Snack time", alt: "Muchi enjoying a snack delivery with treats and a courier bird on a Windows desktop" },
  { file: "004", title: "A memory match", alt: "Muchi playing a picture-matching memory game with the player on a Windows desktop" },
  { file: "002", title: "A friendly card game", alt: "Muchi and the player taking turns in a card game on a Windows desktop" },
  { file: "003", title: "Tic-tac-toe together", alt: "Muchi drawing a tic-tac-toe move on a notepad over a Windows desktop" },
  { file: "001", title: "Chasing bubbles", alt: "Muchi standing on the taskbar below floating soap bubbles on a Windows desktop" },
  { file: "009", title: "Time for a nap", alt: "Muchi curled up asleep in a green bed on a dimmed Windows desktop" },
] as const;

export function MuchiScreenshots() {
  const [selected, setSelected] = useState(0);
  const { t } = useLanguage();
  const screenshot = screenshots[selected];
  const source = `/games/muchi/screenshot-${screenshot.file}.jpg`;
  return (
    <div className="muchi-gallery">
      <figure className="muchi-gallery__selected">
        <a href={source} target="_blank" rel="noreferrer" aria-label={`${t("Open full-size screenshot")}: ${t(screenshot.title)}`}><Image src={source} alt={t(screenshot.alt)} width={1920} height={1080} sizes="(max-width: 1288px) calc(100vw - 48px), 1240px" unoptimized /></a>
        <figcaption><span aria-live="polite"><T>{screenshot.title}</T></span><a href={source} target="_blank" rel="noreferrer" aria-label={t("Open full-size screenshot")}><span aria-hidden="true">{String(selected + 1).padStart(2, "0")} / 07</span><ExternalLinkIcon /></a></figcaption>
      </figure>
      <div className="muchi-gallery__thumbnails" role="group" aria-label={t("Gameplay screenshots")}>
        {screenshots.map((item, index) => <button key={item.file} type="button" aria-pressed={selected === index} aria-label={t(item.title)} title={t(item.title)} onClick={() => setSelected(index)}><Image src={`/games/muchi/screenshot-${item.file}.jpg`} alt="" width={1920} height={1080} sizes="(max-width: 760px) 28vw, 170px" unoptimized /><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></button>)}
      </div>
    </div>
  );
}
