"use client";

import { useState } from "react";
import { T } from "../../../components/LanguageProvider";

type KitLanguage = { code: string; name: string; htmlLang: string };

export function LocalizedKitDownload({ languages }: { languages: KitLanguage[] }) {
  const [code, setCode] = useState("en");
  const selected = languages.find((language) => language.code === code)!;

  return (
    <section className="noema-press-languages" id="downloads" aria-labelledby="press-download-title">
      <div className="page-width noema-press-languages__inner">
        <div>
          <p className="eyebrow noema-eyebrow"><T>For press and creators</T></p>
          <h2 id="press-download-title"><T>Your language. The complete kit.</T></h2>
          <p><T>Choose from all 11 game languages. Each ZIP includes localized descriptions, a factsheet, and a readme, plus the same logos, key art, and five screenshots.</T></p>
          <p className="noema-press-languages__note"><T>Screenshot text remains in its original language. Each download is about 19 MB.</T></p>
        </div>
        <div className="noema-press-languages__controls">
          <label htmlFor="press-kit-language"><T>Press-kit language</T></label>
          <select id="press-kit-language" value={code} onChange={(event) => setCode(event.target.value)}>
            {languages.map((language) => (
              <option key={language.code} value={language.code} lang={language.htmlLang}>{language.name}</option>
            ))}
          </select>
          <a
            className="button noema-button"
            href={`/games/noema/press-kits/noema-press-kit-${code}.zip`}
            download
            hrefLang={selected.htmlLang}
            data-track-event="press_kit_click"
            data-track-placement="noema_press_kit_language"
            data-track-label={`Download NOEMA press kit ${code}`}
          >
            <span><T>Download ZIP</T><small lang={selected.htmlLang}>{selected.name}</small></span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
