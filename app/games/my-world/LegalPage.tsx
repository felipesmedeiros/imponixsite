import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

type LegalSection = { id: string; title: string; text: string };
type LegalCopy = { title: string; sections: LegalSection[] };
type LegalDocument = {
  kind: string;
  version: string;
  languages: Record<"en" | "fr-CA" | "pt-BR", LegalCopy>;
};

const termsPath = "/games/my-world/terms-and-conditions";
const privacyPath = "/games/my-world/privacy-notice";

function LegalSections({ sections, language }: { sections: LegalSection[]; language: string }) {
  return (
    <article className="privacy-policy-document" lang={language}>
      {sections.map(({ id, title, text }) => (
        <section id={`${language}-${id}`} key={id}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
    </article>
  );
}

export function MyWorldLegalPage({ document }: { document: LegalDocument }) {
  const english = document.languages.en;
  const effective = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(document.version));
  return (
    <div className="site-shell privacy-policy-page">
      <SiteHeader />
      <main>
        <header className="privacy-policy-hero">
          <div className="page-width">
            <p className="eyebrow">My World</p>
            <h1>{english.title}</h1>
            <div className="privacy-policy-hero__intro">
              <p className="privacy-policy__effective-date">Effective <time dateTime={document.version}>{effective}</time></p>
              <a className="privacy-policy__back" href={document.kind === "terms" ? privacyPath : termsPath}>
                {document.kind === "terms" ? "Privacy Notice" : "Terms and Conditions"}
              </a>
            </div>
          </div>
        </header>
        <div className="page-width privacy-policy-layout">
          <aside className="privacy-policy-toc">
            <p>On this page</p>
            <nav aria-label={english.title}>
              <a href="#fr-CA" lang="fr-CA">Français (Canada)</a>
              <a href="#pt-BR" lang="pt-BR">Português (Brasil)</a>
              {english.sections.map(section => <a href={`#en-${section.id}`} key={section.id}>{section.title}</a>)}
            </nav>
            <div className="privacy-policy-toc__contact">
              <span>Imponix Game Studio</span>
              <a href="mailto:contact@imponix.com">contact@imponix.com</a>
            </div>
          </aside>
          <div>
            <LegalSections sections={english.sections} language="en" />
            {(["fr-CA", "pt-BR"] as const).map(language => (
              <details id={language} lang={language} className="my-world-legal-translation" key={language}>
                <summary>{language === "fr-CA" ? "Français (Canada)" : "Português (Brasil)"} · {document.languages[language].title}</summary>
                <LegalSections sections={document.languages[language].sections} language={language} />
              </details>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter privacyPolicyHref={privacyPath} termsOfServiceHref={termsPath} />
    </div>
  );
}
