import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width site-footer__top">
        <div>
          <Image
            className="site-footer__logo"
            src="/brand/imponix-logo.png"
            alt="Imponix Game Studio"
            width={941}
            height={244}
          />
          <p>Independent games made by two friends in Montreal.</p>
        </div>

        <div className="site-footer__links">
          <div>
            <p className="footer-label">Explore</p>
            <a href="/#games">Games</a>
            <a href="/studio">Studio</a>
            <a href="/press">Press kits</a>
          </div>
          <div>
            <p className="footer-label">Connect</p>
            <a href="https://www.x.com/imponixgames" target="_blank" rel="noreferrer">X / Twitter</a>
            <a href="https://www.youtube.com/@imponix" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://discord.gg/CAtmxqVVvp" target="_blank" rel="noreferrer">Discord</a>
          </div>
        </div>
      </div>

      <div className="page-width site-footer__bottom">
        <span>© 2026 Imponix Game Studio</span>
        <a href="mailto:contact@imponix.com">contact@imponix.com</a>
      </div>
    </footer>
  );
}
