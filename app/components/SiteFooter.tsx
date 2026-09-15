import Image from "next/image";
import { T } from "./LanguageProvider";

type SiteFooterProps = {
  privacyPolicyHref?: string;
  termsOfServiceHref?: string;
};

export function SiteFooter({ privacyPolicyHref, termsOfServiceHref }: SiteFooterProps = {}) {
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
          <p><T>Independent games made by two friends in Montréal and Fortaleza.</T></p>
        </div>

        <div className="site-footer__links">
          <div>
            <p className="footer-label"><T>Explore</T></p>
            <a href="/#games"><T>Games</T></a>
            <a href="/studio"><T>Studio</T></a>
            <a href="/journal"><T>Journal</T></a>
            <a href="/press"><T>Press kits</T></a>
          </div>
          <div>
            <p className="footer-label"><T>Connect</T></p>
            <a href="https://www.x.com/imponixgames" target="_blank" rel="noreferrer">X / Twitter</a>
            <a href="https://www.youtube.com/@imponix" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="page-width site-footer__bottom">
        <span>© 2026 Imponix Game Studio</span>
        <div className="site-footer__bottom-links">
          {privacyPolicyHref ? <a href={privacyPolicyHref}><T>Privacy Policy</T></a> : null}
          {termsOfServiceHref ? <a href={termsOfServiceHref}><T>Terms of Service</T></a> : null}
          <a href="mailto:contact@imponix.com">contact@imponix.com</a>
        </div>
      </div>
    </footer>
  );
}
