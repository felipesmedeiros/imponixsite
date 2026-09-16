import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "../../../../components/JsonLd";
import { SiteFooter } from "../../../../components/SiteFooter";
import { SiteHeader } from "../../../../components/SiteHeader";
import { createArticleJsonLd, createBreadcrumbJsonLd, createPageMetadata } from "../../../../lib/seo";
import previewNotes from "../../../../../content/game-store-chronicle/version-1-2-0-pre-release.md?raw";

const postTitle = "Version 1.2.0 is almost here | Game Store Chronicle";
const postDescription =
  "Game Store Chronicle version 1.2.0 will enter pre-release this weekend, ahead of a planned official release next week.";

const postPath = "/games/game-store-chronicle/news/version-1-2-0-pre-release";
const postImage = "/games/gsc/version-1-2-0-preview.jpg";

export const metadata: Metadata = createPageMetadata({
  path: postPath,
  title: postTitle,
  description: postDescription,
  type: "article",
  image: postImage,
  imageAlt: "Game Store Chronicle gameplay showing the store management computer",
  publishedTime: "2026-08-15T00:00:00-04:00",
});

const articleJsonLd = createArticleJsonLd({
  path: postPath,
  headline: "Version 1.2.0 will enter pre-release this weekend",
  description: postDescription,
  image: postImage,
  datePublished: "2026-08-15T00:00:00-04:00",
  schemaType: "NewsArticle",
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Game Store Chronicle", path: "/games/game-store-chronicle" },
  { name: "Version 1.2.0 pre-release", path: postPath },
]);

type PreviewSection = {
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

function parsePreview(source: string) {
  const lines = source.trim().split(/\r?\n/);
  const title =
    lines.find((line) => line.startsWith("# "))?.slice(2) ??
    "Version 1.2.0 is entering pre-release this weekend";
  const intro =
    lines.find((line) => line && !line.startsWith("#") && !line.startsWith("- ")) ?? "";
  const sections: PreviewSection[] = [];
  let current: PreviewSection | undefined;

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

const preview = parsePreview(previewNotes);

export default function GameStoreChronicleVersion120PreReleasePage() {
  return (
    <div className="site-shell gsc-page update-article-page">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <header className="update-article-hero update-article-hero--preview">
          <div className="page-width">
            <a className="update-article__back" href="/games/game-store-chronicle#news">
              <span aria-hidden="true">←</span> Game Store Chronicle
            </a>

            <div className="update-preview-hero__grid">
              <div className="update-preview-hero__copy">
                <p className="eyebrow">Development update · Version 1.2.0</p>
                <h1>{preview.title}</h1>
                <p className="update-article__intro">{preview.intro}</p>
                <p className="update-article__date">August 15, 2026</p>
              </div>

              <figure className="update-preview-hero__visual">
                <Image
                  src="/games/gsc/version-1-2-0-preview.jpg"
                  alt="Game Store Chronicle gameplay showing the store management computer"
                  fill
                  sizes="(max-width: 1000px) 100vw, 46vw"
                  priority
                />
                <figcaption>
                  <span>Version 1.2.0</span>
                  <strong>Pre-release this weekend</strong>
                </figcaption>
              </figure>
            </div>

            <div className="update-preview-timeline" aria-label="Version 1.2.0 release plan">
              <div>
                <span>First stop</span>
                <strong>Pre-release build</strong>
                <small>Weekend of Aug 15–16</small>
              </div>
              <b aria-hidden="true">→</b>
              <div>
                <span>Next stop</span>
                <strong>Official build</strong>
                <small>Planned for next week</small>
              </div>
            </div>
          </div>
        </header>

        <div className="update-article-layout update-article-layout--preview page-width">
          <aside className="update-article-toc">
            <p>In this preview</p>
            <nav aria-label="Preview sections">
              {preview.sections.map((section, index) => (
                <a href={`#${section.slug}`} key={section.slug}>
                  <span>0{index + 1}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="update-article-body update-article-body--preview">
            {preview.sections.map((section, index) => (
              <section id={section.slug} key={section.slug}>
                <span className="update-article-body__index">0{index + 1}</span>
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item, itemIndex) => (
                    <li key={`${section.slug}-${itemIndex}`}>
                      <span>
                        <RichText>{item}</RichText>
                      </span>
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
              <p className="eyebrow">See you this weekend</p>
              <h2>Help us prepare the store for 1.2.0.</h2>
            </div>
            <div className="button-row">
              <a
                className="button button--ink"
                href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                target="_blank"
                rel="noreferrer"
              >
                Open on Steam
              </a>
              <a className="text-link text-link--ink" href="/games/game-store-chronicle#news">
                More GSC news
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
