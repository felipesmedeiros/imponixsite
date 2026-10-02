import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createArticleJsonLd, createBreadcrumbJsonLd, createPageMetadata } from "../../lib/seo";

const headline = "NOEMA is playable. Photoncytosis is next.";
const postDescription =
  "NOEMA's free demo is available on Steam now. Photoncytosis's demo is planned for October 2026, with both full games planned for Q1 2027.";
const postPath = "/journal/noema-photoncytosis-demo-update";
const postImage = "/journal/noema-photoncytosis-demo-update-og.png";
const postImageAlt =
  "An Imponix editorial collage combining NOEMA's green terminal and the branching pixel organism from Photoncytosis.";
const publishedTime = "2026-10-02T00:00:00-04:00";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim()
    || requestHeaders.get("host")
    || "localhost:5173";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const imageUrl = new URL(postImage, `${protocol}://${host}`).toString();
  const metadata = createPageMetadata({
    path: postPath,
    title: `${headline} | Imponix Journal`,
    description: postDescription,
    type: "article",
    image: postImage,
    imageAlt: postImageAlt,
    publishedTime,
  });
  const image = { url: imageUrl, width: 1774, height: 887, alt: postImageAlt };

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

const articleJsonLd = createArticleJsonLd({
  path: postPath,
  headline,
  description: postDescription,
  image: postImage,
  datePublished: publishedTime,
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Journal", path: "/journal" },
  { name: "NOEMA and Photoncytosis demos", path: postPath },
]);

export default function NoemaPhotoncytosisDemoUpdatePage() {
  return (
    <div className="site-shell journal-page journal-article-page journal-demos-post">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <header className="journal-article-hero">
          <div className="page-width">
            <a className="journal-article__back" href="/journal">
              <span aria-hidden="true">&larr;</span> Imponix Journal
            </a>
            <p className="eyebrow eyebrow--blue">
              Demo update / <time dateTime="2026-10-02">October 2, 2026</time>
            </p>
            <h1>{headline}</h1>
            <p className="journal-article__intro">
              NOEMA&apos;s free demo is available on Steam now. Photoncytosis&apos;s
              demo is planned for October 2026. Two very different worlds are
              getting ready to share your screen.
            </p>
            <figure className="journal-demos-hero-media">
              <Image
                src={postImage}
                alt={postImageAlt}
                width={1774}
                height={887}
                sizes="(max-width: 1288px) calc(100vw - 48px), 1240px"
                priority
                unoptimized
              />
              <figcaption>Two worlds on one screen. Editorial artwork featuring NOEMA and Photoncytosis.</figcaption>
            </figure>
          </div>
        </header>

        <div className="journal-article-layout page-width">
          <aside className="journal-article-toc">
            <p>In this note</p>
            <nav aria-label="Journal sections">
              <a href="#now-and-next"><span>01</span>Now and next</a>
              <a href="#noema"><span>02</span>NOEMA: play the demo</a>
              <a href="#photoncytosis"><span>03</span>Photoncytosis: this October</a>
              <a href="#full-games"><span>04</span>The full games</a>
            </nav>
          </aside>

          <article className="journal-article-body">
            <section id="now-and-next">
              <span className="journal-article-body__index">01</span>
              <h2>Two demos, two different worlds.</h2>
              <p>
                Both games begin with the screen in front of you. NOEMA turns
                it into an unfamiliar workplace. Photoncytosis turns it into a
                habitat. One asks you to pay attention to what the system is
                hiding; the other invites you to watch a little life grow.
              </p>
              <p>
                These are demos, not the full-game launches. Here is where
                each project stands as of October 2, 2026.
              </p>
              <dl className="journal-demo-schedule">
                <div><dt>NOEMA demo</dt><dd>Available now on Steam</dd></div>
                <div><dt>Photoncytosis demo</dt><dd>Planned for October 2026</dd></div>
                <div><dt>Both full games</dt><dd>Planned for Q1 2027</dd></div>
              </dl>
            </section>

            <section id="noema">
              <span className="journal-article-body__index">02</span>
              <h2>NOEMA: there is work waiting for you.</h2>
              <p>
                NOEMA is a quiet psychological horror experience set entirely
                inside an unfamiliar computer terminal.
              </p>
              <p>
                You take your place at the terminal, reconcile records, follow
                patterns, and process packages whose purpose is never entirely
                clear. Routine becomes ritual. Numbers, sound, and interference
                hint at something beneath the work, and the familiar becomes
                increasingly difficult to ignore.
              </p>
              <figure className="journal-demos-media">
                <Image
                  src="/games/noema/screenshot-reconciliation.png"
                  alt="NOEMA's green terminal displaying a record-reconciliation assignment"
                  width={1920}
                  height={1440}
                  sizes="(max-width: 1000px) 100vw, 800px"
                  unoptimized
                />
                <figcaption>NOEMA: an ordinary assignment at an unfamiliar terminal.</figcaption>
              </figure>
              <p>
                The free demo is available on Steam now. If that quiet,
                unsettling kind of mystery sounds like your thing, you can
                step inside today. The full game is still in development.
              </p>
              <div className="journal-article-actions">
                <a
                  className="button button--ink"
                  href="https://store.steampowered.com/app/5254450/NOEMA_Demo"
                  target="_blank"
                  rel="noreferrer"
                  data-track-label="Play NOEMA demo from Journal"
                  data-track-placement="journal_noema_demo"
                >
                  Play the free NOEMA demo <ExternalLinkIcon />
                </a>
                <a className="text-link" href="/games/noema" data-track-placement="journal_noema_demo">
                  Explore NOEMA <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </section>

            <section id="photoncytosis">
              <span className="journal-article-body__index">03</span>
              <h2>Photoncytosis: a little life beside your work.</h2>
              <p>
                Photoncytosis is a desktop-life simulation in development.
                In the current prototype, its small organism feeds on the light of your screen, stores
                energy cell by cell, and treats your everyday desktop as its
                environment.
              </p>
              <p>
                It is a different kind of attention: watching a creature
                respond to the world already on your screen. Feeder, motor,
                and structural cells give that growing body different jobs,
                while the microscope lets you look closer at its life.
              </p>
              <figure className="journal-demos-media">
                <Image
                  src="/games/photoncytosis/screenshot2.png"
                  alt="Photoncytosis's development build showing an organism under the microscope beside its desktop controls"
                  width={2560}
                  height={1440}
                  sizes="(max-width: 1000px) 100vw, 800px"
                  unoptimized
                />
                <figcaption>Photoncytosis development build: a closer look at the organism. The demo may look different.</figcaption>
              </figure>
              <p>
                The Photoncytosis demo is planned for October 2026. It will
                offer an early look at this small desktop world. October is
                the planned demo window, not the release of the full game.
              </p>
              <div className="journal-article-actions">
                <a className="button button--ink" href="/games/photoncytosis" data-track-placement="journal_photoncytosis_demo">
                  Meet Photoncytosis <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </section>

            <section id="full-games">
              <span className="journal-article-body__index">04</span>
              <h2>Demos first. Full games next.</h2>
              <p>
                The full releases of both NOEMA and Photoncytosis are planned
                for Q1 2027. The demos are a chance to meet these projects
                before those full releases.
              </p>
              <p>
                For now, the invitation is simple: try NOEMA, get to know
                Photoncytosis, and tell us what stays with you. What felt
                intriguing? What was unclear? What made you want to look
                closer? Those are the conversations we want to have while
                these games are still taking shape.
              </p>
              <div className="journal-article-actions">
                <a className="text-link" href="mailto:contact@imponix.com" data-track-placement="journal_demo_feedback">
                  Share your thoughts <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </section>
          </article>
        </div>

        <section className="journal-article-footer">
          <div className="page-width">
            <p className="eyebrow eyebrow--blue">From our little studio</p>
            <h2>Find your next world.</h2>
            <Link className="text-link" href="/#games" data-track-placement="journal_demo_footer">
              Explore our games <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
