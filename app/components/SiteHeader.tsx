"use client";

import Image from "next/image";
import { useRef } from "react";

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
            <summary>Games <span aria-hidden="true">+</span></summary>
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
          <a href="/studio">Studio</a>
          <a href="/journal">Journal</a>
          <a href="/press">Press</a>
        </nav>

        <a
          className="site-header__contact"
          href="mailto:contact@imponix.com"
        >
          Contact
        </a>

        <details className="mobile-menu" ref={mobileMenuRef}>
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <span className="mobile-menu__label">Games</span>
            <a className="mobile-menu__game" href="/games/game-store-chronicle" onClick={closeMobileMenu}>Game Store Chronicle</a>
            <a className="mobile-menu__game" href="/games/veil-of-shadows" onClick={closeMobileMenu}>Veil of Shadows</a>
            <a href="/studio" onClick={closeMobileMenu}>Studio</a>
            <a href="/journal" onClick={closeMobileMenu}>Journal</a>
            <a href="/press" onClick={closeMobileMenu}>Press</a>
            <a href="mailto:contact@imponix.com" onClick={closeMobileMenu}>Contact</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
