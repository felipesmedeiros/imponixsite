import type { Metadata } from "next";
import { SiteFooter } from "../../../../components/SiteFooter";
import { SiteHeader } from "../../../../components/SiteHeader";
import updateNotes from "../../../../../content/game-store-chronicle/update-1-1-5.md?raw";

export const metadata: Metadata = {
  title: "Update 1.1.5 | Game Store Chronicle",
  description:
    "Game Store Chronicle Update 1.1.5 adds Simulation Mode, a persistent city population, performance improvements, three save slots, Sandbox tools, deeper Store Reports, and more.",
};

type UpdateSection = {
  title: string;
  slug: string;
  items: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseUpdate(source: string) {
  const lines = source.trim().split(/\r?\n/);
  const title = lines.find((line) => line.startsWith("# "))?.slice(2) ?? "Update 1.1.5";
  const intro = lines.find((line) => line && !line.startsWith("#") && !line.startsWith("- ")) ?? "";
  const sections: UpdateSection[] = [];
  let current: UpdateSection | undefined;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const sectionTitle = line.slice(3);
      current = { title: sectionTitle, slug: slugify(sectionTitle), items: [] };
      sections.push(current);
    } else if (line.startsWith("- ") && current) {
      current.items.push(line.slice(2));
    }
  }

  return { title, intro, sections };
}

function RichText({ children }: { children: string }) {
  const parts = children.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

const update = parseUpdate(updateNotes);

export default function GameStoreChronicleUpdate115Page() {
  return (
    <div className="site-shell gsc-page update-article-page">
      <SiteHeader />
      <main>
        <header className="update-article-hero">
          <div className="page-width">
            <a className="update-article__back" href="/games/game-store-chronicle#news">
              <span aria-hidden="true">←</span> Game Store Chronicle
            </a>
            <p className="eyebrow">Patch notes · Version 1.1.5</p>
            <h1>{update.title}</h1>
            <p className="update-article__intro">{update.intro}</p>
          </div>
        </header>

        <div className="update-article-layout page-width">
          <aside className="update-article-toc">
            <p>In this update</p>
            <nav aria-label="Update sections">
              {update.sections.map((section, index) => (
                <a href={`#${section.slug}`} key={section.slug}>
                  <span>0{index + 1}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="update-article-body">
            {update.sections.map((section, index) => (
              <section id={section.slug} key={section.slug}>
                <span className="update-article-body__index">0{index + 1}</span>
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <li key={`${section.slug}-${itemIndex}`}>
                      <RichText>{item}</RichText>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
        </div>

        <section className="update-article-footer">
          <div className="page-width">
            <div>
              <p className="eyebrow">Back to business</p>
              <h2>Ready to open the store?</h2>
            </div>
            <div className="button-row">
              <a className="button button--ink" href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/" target="_blank" rel="noreferrer">
                Play on Steam
              </a>
              <a className="text-link text-link--ink" href="/games/game-store-chronicle">
                Explore the game
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        privacyPolicyHref="/games/game-store-chronicle/privacy-policy"
        termsOfServiceHref="/games/game-store-chronicle/terms-of-service"
      />
    </div>
  );
}
