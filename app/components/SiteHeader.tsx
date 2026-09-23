"use client";

import Image from "next/image";
import { useRef } from "react";
import { LanguageSwitcher, T } from "./LanguageProvider";

export function SiteHeader() {
  const gamesMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const closeGamesMenu = () => {
    if (gamesMenuRef.current) gamesMenuRef.current.open = false;
  };

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  };

  return (
    <header className="site-header">
      <div className="site-header__inner page-width">
        <a className="site-header__brand" href="/" aria-label="Imponix home">
          <Image
            src="/brand/imponix-logo.png"
            alt="Imponix Game Studio"
            width={941}
            height={244}
            priority
          />
        </a>

        <nav className="site-header__nav" aria-label="Primary navigation">
          <details className="games-menu" ref={gamesMenuRef}>
            <summary><T>Games</T> <span aria-hidden="true">+</span></summary>
            <div className="games-menu__submenu">
              <a href="/games/game-store-chronicle" onClick={closeGamesMenu}>
                <Image
                  className="games-menu__logo games-menu__logo--gsc"
                  src="/games/gsc/menu-logo.png"
                  alt=""
                  width={180}
                  height={180}
                />
                <span className="games-menu__game-title">Game Store Chronicle</span>
              </a>
              <a href="/games/noema" onClick={closeGamesMenu}>
                <Image
                  className="games-menu__logo games-menu__logo--noema"
                  src="/games/noema/library-logo.png"
                  alt="NOEMA"
                  width={800}
                  height={720}
                />
                <span className="games-menu__game-status"><T>Demo available</T></span>
              </a>
              <a href="/games/veil-of-shadows" onClick={closeGamesMenu}>
                <Image
                  className="games-menu__logo games-menu__logo--vos"
                  src="/games/vos/menu-logo.png"
                  alt=""
                  width={260}
                  height={194}
                />
                <span className="games-menu__game-title">Veil of Shadows</span>
              </a>
            </div>
          </details>
          <a href="/studio"><T>Studio</T></a>
          <a href="/journal"><T>Journal</T></a>
          <a href="/press"><T>Press</T></a>
        </nav>

        <LanguageSwitcher />

        <a
          className="site-header__contact"
          href="mailto:contact@imponix.com"
        >
          <T>Contact</T>
        </a>

        <details className="mobile-menu" ref={mobileMenuRef}>
          <summary aria-label="Open navigation"><T>Menu</T></summary>
          <nav aria-label="Mobile navigation">
            <span className="mobile-menu__label"><T>Games</T></span>
            <a className="mobile-menu__game" href="/games/game-store-chronicle" onClick={closeMobileMenu}>Game Store Chronicle</a>
            <a className="mobile-menu__game" href="/games/noema" onClick={closeMobileMenu}>NOEMA · <T>Demo available</T></a>
            <a className="mobile-menu__game" href="/games/veil-of-shadows" onClick={closeMobileMenu}>Veil of Shadows</a>
            <a href="/studio" onClick={closeMobileMenu}><T>Studio</T></a>
            <a href="/journal" onClick={closeMobileMenu}><T>Journal</T></a>
            <a href="/press" onClick={closeMobileMenu}><T>Press</T></a>
            <a href="mailto:contact@imponix.com" onClick={closeMobileMenu}><T>Contact</T></a>
            <LanguageSwitcher mobile />
          </nav>
        </details>
      </div>
    </header>
  );
}
