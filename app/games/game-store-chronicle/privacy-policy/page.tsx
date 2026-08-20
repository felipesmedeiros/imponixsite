import type { Metadata } from "next";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";

const policyTitle = "Privacy Policy | Game Store Chronicle";
const policyDescription =
  "Learn how Imponix Game Studio handles information related to Game Store Chronicle.";

export const metadata: Metadata = {
  title: policyTitle,
  description: policyDescription,
  openGraph: {
    type: "website",
    title: policyTitle,
    description: policyDescription,
    images: [],
  },
  twitter: {
    card: "summary",
    title: policyTitle,
    description: policyDescription,
    images: [],
  },
};

const sections = [
  ["information-we-collect", "Information We Collect"],
  ["how-we-use-information", "How We Use Information"],
  ["steam-and-platform-data", "Steam and Platform Data"],
  ["sharing-information", "Sharing Information"],
  ["data-retention", "Data Retention"],
  ["childrens-privacy", "Children’s Privacy"],
  ["your-rights", "Your Rights"],
  ["security", "Security"],
  ["international-users", "International Users"],
  ["changes", "Changes to This Privacy Policy"],
];

export default function GameStoreChroniclePrivacyPolicyPage() {
  return (
    <div className="site-shell gsc-page privacy-policy-page">
      <SiteHeader />
      <main>
        <header className="privacy-policy-hero">
          <div className="page-width">
            <a className="privacy-policy__back" href="/games/game-store-chronicle">
              <span aria-hidden="true">←</span> Game Store Chronicle
            </a>
            <p className="eyebrow">Legal · Game Store Chronicle</p>
            <h1>Privacy Policy</h1>
            <div className="privacy-policy-hero__intro">
              <p className="privacy-policy__effective-date">Effective Date: July 18, 2026</p>
              <p>
                This Privacy Policy explains how Imponix Game Studio (“we,” “us,” or “our”)
                handles information related to Game Store Chronicle.
              </p>
            </div>
          </div>
        </header>

        <div className="page-width privacy-policy-layout">
          <aside className="privacy-policy-toc">
            <p>On this page</p>
            <nav aria-label="Privacy Policy sections">
              {sections.map(([slug, title], index) => (
                <a href={`#${slug}`} key={slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </a>
              ))}
            </nav>
            <div className="privacy-policy-toc__contact">
              <span>Privacy questions</span>
              <a href="mailto:contact@imponix.com">contact@imponix.com</a>
            </div>
          </aside>

          <article className="privacy-policy-document">
            <section id="information-we-collect">
              <span className="privacy-policy-document__index">01</span>
              <h2>Information We Collect</h2>
              <p>
                Game Store Chronicle is designed as a game experience. We may collect limited
                information depending on how you use the Game and related services.
              </p>
              <p>We may collect:</p>
              <ul>
                <li>
                  Information you provide when contacting us, such as your name, email address,
                  and message.
                </li>
                <li>
                  Technical information such as device type, operating system, crash reports, bug
                  reports, performance data, and gameplay-related diagnostics.
                </li>
                <li>
                  Platform-related information provided by Steam or another storefront, such as
                  your platform username, user ID, achievements, cloud save status, or purchase
                  ownership status, where applicable.
                </li>
                <li>
                  Optional analytics data, if enabled, to help us understand crashes, performance,
                  and general gameplay usage.
                </li>
              </ul>
              <p>
                We do not collect payment card information directly. Purchases and payments are
                handled by the platform where you buy the Game.
              </p>
            </section>

            <section id="how-we-use-information">
              <span className="privacy-policy-document__index">02</span>
              <h2>How We Use Information</h2>
              <p>We use information to:</p>
              <ul>
                <li>Provide, maintain, and improve the Game.</li>
                <li>Fix bugs, crashes, and technical issues.</li>
                <li>Respond to support requests.</li>
                <li>Verify ownership or platform-related functionality.</li>
                <li>Improve gameplay balance, performance, and user experience.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section id="steam-and-platform-data">
              <span className="privacy-policy-document__index">03</span>
              <h2>Steam and Platform Data</h2>
              <p>
                If you play Game Store Chronicle through Steam, Valve may collect and process
                information under its own privacy policy and subscriber agreement. Steam features
                such as purchases, refunds, achievements, cloud saves, friends, reviews, and
                playtime may be managed by Valve.
              </p>
            </section>

            <section id="sharing-information">
              <span className="privacy-policy-document__index">04</span>
              <h2>Sharing Information</h2>
              <p>We do not sell your personal information.</p>
            </section>

            <section id="data-retention">
              <span className="privacy-policy-document__index">05</span>
              <h2>Data Retention</h2>
              <p>
                We keep information only as long as reasonably necessary for the purposes described
                in this Privacy Policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section id="childrens-privacy">
              <span className="privacy-policy-document__index">06</span>
              <h2>Children’s Privacy</h2>
              <p>
                Game Store Chronicle is not intended to knowingly collect personal information from
                children under the age required by applicable law. If you believe a child has
                provided us personal information, contact us and we will take appropriate steps to
                delete it.
              </p>
            </section>

            <section id="your-rights">
              <span className="privacy-policy-document__index">07</span>
              <h2>Your Rights</h2>
              <p>
                Depending on where you live, you may have rights to access, correct, delete,
                restrict, or object to the use of your personal information. You may contact us to
                make a privacy request.
              </p>
            </section>

            <section id="security">
              <span className="privacy-policy-document__index">08</span>
              <h2>Security</h2>
              <p>
                We use reasonable measures to protect information, but no method of transmission or
                storage is completely secure.
              </p>
            </section>

            <section id="international-users">
              <span className="privacy-policy-document__index">09</span>
              <h2>International Users</h2>
              <p>
                If you access the Game from outside our country of operation, your information may
                be processed in countries with different data protection laws.
              </p>
            </section>

            <section id="changes">
              <span className="privacy-policy-document__index">10</span>
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be
                posted with a new effective date.
              </p>
            </section>

          </article>
        </div>
      </main>
      <SiteFooter
        privacyPolicyHref="/games/game-store-chronicle/privacy-policy"
        termsOfServiceHref="/games/game-store-chronicle/terms-of-service"
      />
    </div>
  );
}
