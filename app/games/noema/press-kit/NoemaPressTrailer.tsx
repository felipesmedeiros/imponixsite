"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLinkIcon } from "../../../components/ExternalLinkIcon";
import { T, useLanguage } from "../../../components/LanguageProvider";

export function NoemaPressTrailer() {
  const [playing, setPlaying] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="noema-press-trailer">
      <div className="noema-press-trailer__screen">
        {playing ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/N-IJlV005Vc?autoplay=1&rel=0"
            title={t("NOEMA announcement trailer")}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button className="noema-press-trailer__play" onClick={() => setPlaying(true)}>
            <Image src="/games/noema/press/02-signal-terminal.png" alt="" fill sizes="(max-width: 800px) 100vw, 960px" />
            <span><span aria-hidden="true">▶</span><T>Play NOEMA trailer</T></span>
          </button>
        )}
      </div>
      <div className="noema-press-trailer__caption">
        <span><T>Official announcement trailer</T></span>
        <a className="text-link" href="https://www.youtube.com/watch?v=N-IJlV005Vc" target="_blank" rel="noreferrer" data-track-placement="noema_press_trailer">
          <T>Watch on YouTube</T> <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
