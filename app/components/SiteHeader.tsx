import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-width">
        <Link className="site-header__brand" href="/" aria-label="Imponix home">
          <Image
            src="/brand/imponix-logo.png"
            alt="Imponix Game Studio"
            width={941}
            height={244}
            priority
          />
        </Link>

        <nav className="site-header__nav" aria-label="Primary navigation">
          <Link href="/#games">Games</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/press">Press</Link>
        </nav>

        <a
          className="site-header__contact"
          href="mailto:contact@imponix.com"
        >
          Contact
        </a>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#games">Games</Link>
            <Link href="/studio">Studio</Link>
            <Link href="/press">Press</Link>
            <a href="mailto:contact@imponix.com">Contact</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
