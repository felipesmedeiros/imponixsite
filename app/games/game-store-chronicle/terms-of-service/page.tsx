import type { Metadata } from "next";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";

const termsTitle = "Terms of Service | Game Store Chronicle";
const termsDescription =
  "Read the Terms of Service for Game Store Chronicle from Imponix Game Studio.";

export const metadata: Metadata = {
  title: termsTitle,
  description: termsDescription,
  openGraph: {
    type: "website",
    title: termsTitle,
    description: termsDescription,
    images: [],
  },
  twitter: {
    card: "summary",
    title: termsTitle,
    description: termsDescription,
    images: [],
  },
};

const sections = [
  ["license-to-use-the-game", "License to Use the Game"],
  ["ownership", "Ownership"],
  ["acceptable-use", "Acceptable Use"],
  ["steam-and-third-party-platforms", "Steam and Third-Party Platforms"],
  ["updates-and-changes", "Updates and Changes"],
  ["refunds", "Refunds"],
  ["user-content", "User Content"],
  ["disclaimer", "Disclaimer"],
  ["limitation-of-liability", "Limitation of Liability"],
  ["termination", "Termination"],
  ["changes-to-these-terms", "Changes to These Terms"],
];

export default function GameStoreChronicleTermsOfServicePage() {
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
            <h1>Terms of Service</h1>
            <div className="privacy-policy-hero__intro">
              <p className="privacy-policy__effective-date">Effective Date: July 18, 2026</p>
              <p>
                These Terms of Service apply to Game Store Chronicle (“the Game”), developed and
                published by Imponix Game Studio (“we,” “us,” or “our”). By purchasing,
                downloading, installing, or playing the Game, you agree to these Terms.
              </p>
            </div>
          </div>
        </header>

        <div className="page-width privacy-policy-layout">
          <aside className="privacy-policy-toc">
            <p>On this page</p>
            <nav aria-label="Terms of Service sections">
              {sections.map(([slug, title], index) => (
                <a href={`#${slug}`} key={slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </a>
              ))}
            </nav>
            <div className="privacy-policy-toc__contact">
              <span>Terms questions</span>
              <a href="mailto:contact@imponix.com">contact@imponix.com</a>
            </div>
          </aside>

          <article className="privacy-policy-document">
            <section id="license-to-use-the-game">
              <span className="privacy-policy-document__index">01</span>
              <h2>License to Use the Game</h2>
              <p>
                We grant you a personal, limited, non-exclusive, non-transferable, revocable license
                to install and play the Game for your own personal entertainment. You do not own the
                Game, its code, art, music, characters, text, design, or other content.
              </p>
            </section>

            <section id="ownership">
              <span className="privacy-policy-document__index">02</span>
              <h2>Ownership</h2>
              <p>
                Game Store Chronicle and all related content are owned by Imponix Game Studio or its
                licensors. All rights not expressly granted in these Terms are reserved.
              </p>
            </section>

            <section id="acceptable-use">
              <span className="privacy-policy-document__index">03</span>
              <h2>Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Copy, redistribute, sell, rent, or sublicense the Game.</li>
                <li>
                  Reverse engineer, decompile, or modify the Game except where allowed by law.
                </li>
                <li>
                  Use cheats, exploits, bots, or unauthorized tools that affect gameplay or
                  services.
                </li>
                <li>
                  Upload or share harmful, illegal, abusive, or infringing content if the Game
                  supports user content.
                </li>
                <li>Use the Game in a way that violates applicable laws or platform rules.</li>
              </ul>
            </section>

            <section id="steam-and-third-party-platforms">
              <span className="privacy-policy-document__index">04</span>
              <h2>Steam and Third-Party Platforms</h2>
              <p>
                If you access the Game through Steam or another platform, your purchase, refund
                rights, account, downloads, achievements, cloud saves, and platform features may
                also be governed by that platform’s own terms and policies. Steam purchases and
                refunds are handled by Valve under Steam’s policies.
              </p>
            </section>

            <section id="updates-and-changes">
              <span className="privacy-policy-document__index">05</span>
              <h2>Updates and Changes</h2>
              <p>
                We may update, patch, balance, modify, or discontinue parts of the Game at any time.
                We may also add, change, or remove features, content, or functionality.
              </p>
            </section>

            <section id="refunds">
              <span className="privacy-policy-document__index">06</span>
              <h2>Refunds</h2>
              <p>
                Refunds are handled by the platform where you purchased the Game. For Steam
                purchases, please refer to Steam’s refund policy.
              </p>
            </section>

            <section id="user-content">
              <span className="privacy-policy-document__index">07</span>
              <h2>User Content</h2>
              <p>
                If the Game allows you to create, upload, or share content, you remain responsible
                for that content. By sharing content through the Game, you grant us a limited right
                to use, display, reproduce, and distribute that content as needed to operate and
                promote the Game.
              </p>
            </section>

            <section id="disclaimer">
              <span className="privacy-policy-document__index">08</span>
              <h2>Disclaimer</h2>
              <p>
                The Game is provided “as is” and “as available.” We do not guarantee that the Game
                will be error-free, uninterrupted, compatible with every device, or free from bugs.
              </p>
            </section>

            <section id="limitation-of-liability">
              <span className="privacy-policy-document__index">09</span>
              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent allowed by law, Imponix Game Studio will not be liable for
                indirect, incidental, special, consequential, or punitive damages arising from your
                use of the Game.
              </p>
            </section>

            <section id="termination">
              <span className="privacy-policy-document__index">10</span>
              <h2>Termination</h2>
              <p>
                We may suspend or terminate your access to the Game or related services if you
                violate these Terms or applicable platform rules.
              </p>
            </section>

            <section id="changes-to-these-terms">
              <span className="privacy-policy-document__index">11</span>
              <h2>Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The updated version will be posted with
                a new effective date. Continued use of the Game after changes means you accept the
                updated Terms.
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
