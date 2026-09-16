"use client";

import { ExternalLinkIcon } from "../../../components/ExternalLinkIcon";
import { T, useLanguage } from "../../../components/LanguageProvider";

export function NoemaPressTrailer() {
  const { t } = useLanguage();

  return (
    <div className="noema-press-trailer">
      <div className="noema-press-trailer__screen">
        <iframe
          src="https://www.youtube-nocookie.com/embed/N-IJlV005Vc?rel=0"
          title={t("NOEMA announcement trailer")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
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
