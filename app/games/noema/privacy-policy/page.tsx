import type { Metadata } from "next";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { createPageMetadata } from "../../../lib/seo";

const policyPath = "/games/noema/privacy-policy";
const contactEmail = "contact@imponix.com";
const contactHref = `mailto:${contactEmail}?subject=NOEMA%20Xbox%20Privacy`;

export const metadata: Metadata = createPageMetadata({
  path: policyPath,
  title: "NOEMA Xbox Privacy Policy | Imponix Game Studio",
  description: "How Imponix Game Studio handles player information when you play NOEMA on Xbox.",
  image: "/games/noema/main-capsule.png",
  imageAlt: "The NOEMA terminal and its luminous signal mark",
});

const sections = [
  {
    id: "xbox-profile-and-saves",
    title: "Xbox profile and saves",
    content: (
      <>
        <p>
          NOEMA uses the Xbox user ID from your signed-in profile to load and save progress for
          that profile. The game holds this ID in memory during play. You sign in through Xbox.
        </p>
        <p>
          NOEMA stores your game progress and settings in Xbox-managed storage tied to your
          profile. Xbox can sync this data through Microsoft’s cloud save service so you can
          continue playing on another Xbox console with the same profile. The game uses Xbox’s
          profile-specific storage controls to keep saves separate between players.
        </p>
      </>
    ),
  },
  {
    id: "achievements-and-microsoft-services",
    title: "Achievements and Microsoft services",
    content: (
      <>
        <p>
          When you earn an achievement, NOEMA sends your Xbox user ID and the achievement unlock
          to Microsoft through the Xbox network. Microsoft records the achievement on your profile.
          Your Xbox privacy settings control who can see it.
        </p>
        <p>
          NOEMA on Xbox has no in-game advertising or publisher-run gameplay analytics. Imponix
          Game Studio uses Xbox network data to provide the game’s Xbox features. We do not sell,
          license, or share Xbox network data with advertisers, data brokers, or other third
          parties.
        </p>
        <p>
          Microsoft handles Xbox accounts, store purchases, cloud saves, achievements, and platform
          diagnostics under the{" "}
          <a href="https://www.microsoft.com/en-us/privacy/privacystatement">Microsoft Privacy Statement</a>.
        </p>
      </>
    ),
  },
  {
    id: "support-requests",
    title: "Support requests",
    content: (
      <>
        <p>
          If you email us about NOEMA on Xbox, we receive your email address, your message, and
          anything you choose to include, such as a screenshot or details about a problem. We use
          this information to answer your request and investigate the issue. Our email service
          provider processes these messages to deliver and store them.
        </p>
        <p>
          We keep support correspondence for as long as reasonably necessary to resolve and
          follow up on the issue, or longer if required by law.
        </p>
      </>
    ),
  },
  {
    id: "your-choices-and-rights",
    title: "Your choices and rights",
    content: (
      <>
        <p>
          To review or change what other players can see, use your Xbox privacy and online safety
          settings. You can manage or delete NOEMA saved data from your console’s game management
          settings. See <a href="https://support.xbox.com/en-US/help/games-apps/game-setup-and-play/cloud-game-saves-faq">Xbox Support’s cloud saves FAQ</a>{" "}
          for the difference between deleting a save from one console and deleting it everywhere.
          Use the <a href="https://account.microsoft.com/privacy">Microsoft privacy dashboard</a>{" "}
          for controls over data held by Microsoft.
        </p>
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal
          information we hold about you, or to restrict or object to its use. To make a request,
          ask a privacy question, or raise a concern about a child’s information, email{" "}
          <a href={contactHref}>{contactEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: "policy-updates",
    title: "Policy updates",
    content: (
      <p>We’ll post any updates to this policy on this page and revise the effective date.</p>
    ),
  },
];

export default function NoemaXboxPrivacyPolicyPage() {
  return (
    <div className="site-shell privacy-policy-page noema-privacy-policy">
      <SiteHeader />
      <main lang="en">
        <header className="privacy-policy-hero">
          <div className="page-width">
            <a className="privacy-policy__back" href="/games/noema">Back to NOEMA</a>
            <h1>NOEMA Xbox Privacy Policy</h1>
            <div className="privacy-policy-hero__intro">
              <p className="privacy-policy__effective-date">
                Effective <time dateTime="2026-11-18">November 18, 2026</time>
              </p>
              <p>
                This policy explains how Imponix Game Studio handles your information when you
                play NOEMA on Xbox.
              </p>
            </div>
          </div>
        </header>

        <div className="page-width privacy-policy-layout">
          <aside className="privacy-policy-toc">
            <p>On this page</p>
            <nav aria-label="Privacy policy sections">
              {sections.map(({ id, title }) => <a href={`#${id}`} key={id}>{title}</a>)}
            </nav>
            <div className="privacy-policy-toc__contact">
              <span>Privacy contact</span>
              <a href={contactHref}>{contactEmail}</a>
            </div>
          </aside>

          <article className="privacy-policy-document">
            {sections.map(({ id, title, content }) => (
              <section id={id} key={id}>
                <h2>{title}</h2>
                {content}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter privacyPolicyHref={policyPath} />
    </div>
  );
}
