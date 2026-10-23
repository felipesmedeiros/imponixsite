import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { JsonLd } from "../../components/JsonLd";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createArticleJsonLd, createBreadcrumbJsonLd, createPageMetadata } from "../../lib/seo";

const headline = "Photoncytosis is playable. Muchi is coming this year.";
const postDescription = "The Photoncytosis demo is available on Steam now. Muchi, our cozy free-to-play desktop pet, will arrive on Windows before the end of 2026. Wishlist Muchi on Steam.";
const postPath = "/journal/photoncytosis-demo-muchi-2026";
const postImage = "/journal/photoncytosis-demo-muchi-2026-og.png";
const postImageAlt = "Editorial illustration pairing Photoncytosis’s branching teal pixel organism with Muchi, the cream-and-apricot desktop pet, beside two desktop windows.";
const publishedTime = "2026-10-22T00:00:00-04:00";
const imageWidth = 1774;
const imageHeight = 887;
const photonDemoUrl = "https://store.steampowered.com/app/5372510/Photoncytosis_Demo/";
const muchiSteamUrl = "https://store.steampowered.com/app/5473030/Muchi";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim()
    || requestHeaders.get("host")
    || "localhost:3000";
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
  const image = { url: imageUrl, width: imageWidth, height: imageHeight, alt: postImageAlt };
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
  { name: "Photoncytosis and Muchi update", path: postPath },
]);

export default function PhotoncytosisMuchiUpdatePage() {
  return (
    <div className="site-shell journal-page journal-article-page journal-demos-post">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <header className="journal-article-hero">
          <div className="page-width">
            <a className="journal-article__back" href="/journal"><span aria-hidden="true">←</span> Imponix Journal</a>
            <p className="eyebrow eyebrow--blue">Studio update / <time dateTime="2026-10-22">October 22, 2026</time></p>
            <h1>{headline}</h1>
            <p className="journal-article__intro">
              The Photoncytosis demo is available on Steam now. Muchi, our cozy
              desktop pet, will arrive before the end of 2026 as a free-to-play
              game for Windows. One little desktop world is ready to explore;
              another will be joining it soon.
            </p>
            <figure className="journal-demos-hero-media">
              <Image src={postImage} alt={postImageAlt} width={imageWidth} height={imageHeight}
                sizes="(max-width: 1288px) calc(100vw - 48px), 1240px" priority unoptimized />
              <figcaption>Two kinds of desktop company. Editorial artwork featuring Photoncytosis and Muchi.</figcaption>
            </figure>
          </div>
        </header>

        <div className="journal-article-layout page-width">
          <aside className="journal-article-toc">
            <p>In this note</p>
            <nav aria-label="Journal sections">
              <a href="#now-and-next"><span>01</span>Now and next</a>
              <a href="#photoncytosis"><span>02</span>Photoncytosis: play now</a>
              <a href="#muchi"><span>03</span>Muchi: before year’s end</a>
              <a href="#stay-in-touch"><span>04</span>Come spend a little time</a>
            </nav>
          </aside>

          <article className="journal-article-body">
            <section id="now-and-next">
              <span className="journal-article-body__index">01</span>
              <h2>A little life alongside your day.</h2>
              <p>
                We have two pieces of news from our little studio: you can now
                try Photoncytosis, and Muchi will be with you before the year is
                out. Both projects make room for something small beside your
                everyday tasks, each in its own way.
              </p>
              <dl className="journal-demo-schedule">
                <div><dt>Photoncytosis demo</dt><dd>Available now on Steam</dd></div>
                <div><dt>Muchi full game</dt><dd>Coming Q4 2026 · Free to play · Windows</dd></div>
                <div><dt>Photoncytosis full game</dt><dd>Planned for Q1 2027</dd></div>
              </dl>
            </section>

            <section id="photoncytosis">
              <span className="journal-article-body__index">02</span>
              <h2>Photoncytosis: your desktop is its habitat.</h2>
              <p>
                The Photoncytosis demo is ready to play on Steam. Meet a tiny
                organism that feeds on screen light, stores energy in its cells,
                and makes your desktop its environment.
              </p>
              <p>
                Take a closer look under the microscope, watch cells with
                different jobs work together, and see how a little life responds
                to the light and space already on your screen.
              </p>
              <figure className="journal-demos-media">
                <Image src="/games/photoncytosis/screenshot2.png"
                  alt="Photoncytosis’s development build showing a connected organism under the microscope beside its desktop controls"
                  width={2560} height={1440} sizes="(max-width: 1000px) 100vw, 800px" unoptimized />
                <figcaption>Photoncytosis development gameplay: looking closer at life, one cell at a time.</figcaption>
              </figure>
              <p>
                This is the demo, an early look at Photoncytosis while the full
                game remains in development. The full release is planned for
                Q1 2027. For now, there is a small experiment waiting for you
                to try.
              </p>
              <div className="journal-article-actions">
                <a className="button button--ink" href={photonDemoUrl} target="_blank" rel="noreferrer"
                  data-track-game="photoncytosis" data-track-label="Play Photoncytosis demo from Journal" data-track-placement="journal_photoncytosis_demo_muchi">
                  Play the Photoncytosis demo <ExternalLinkIcon />
                </a>
                <a className="text-link" href="https://photon.imponix.com" data-track-game="photoncytosis" data-track-placement="journal_photoncytosis_demo_muchi">
                  Explore Photoncytosis <ExternalLinkIcon />
                </a>
              </div>
            </section>

            <section id="muchi">
              <span className="journal-article-body__index">03</span>
              <h2>Muchi will arrive before the end of 2026.</h2>
              <p>
                Muchi will bring a softer kind of company to your desktop.
                Our cozy desktop pet will launch on Windows in Q4 2026 as a
                free-to-play game.
              </p>
              <p>
                You will be able to share snacks and quiet moments, take a
                break with little games, and grow flowers beside your everyday
                tasks. Muchi will wander, play, and rest alongside your day,
                leaving you room to carry on with your own thing.
              </p>
              <figure className="journal-demos-media">
                <Image src="/games/muchi/screenshot-007.jpg"
                  alt="Muchi beside a small garden of colourful flowers and a bee on a Windows desktop"
                  width={1920} height={1080} sizes="(max-width: 1000px) 100vw, 800px" unoptimized />
                <figcaption>Muchi development gameplay. The final game may look different.</figcaption>
              </figure>
              <p>
                Muchi is still in pre-release. The Steam page is live, and you
                can add the game to your wishlist while we get it ready for
                its arrival later this year.
              </p>
              <div className="journal-article-actions">
                <a className="button button--ink" href={muchiSteamUrl} target="_blank" rel="noreferrer"
                  data-track-game="muchi" data-track-label="Wishlist Muchi on Steam from Journal" data-track-placement="journal_muchi_2026">
                  Wishlist Muchi on Steam <ExternalLinkIcon />
                </a>
                <a className="text-link" href="https://muchi.imponix.com" data-track-game="muchi" data-track-placement="journal_muchi_2026">
                  Meet Muchi <ExternalLinkIcon />
                </a>
              </div>
            </section>

            <section id="stay-in-touch">
              <span className="journal-article-body__index">04</span>
              <h2>Come spend a little time with them.</h2>
              <p>
                Try the Photoncytosis demo, wishlist Muchi, and tell us how
                these small desktop worlds fit into your day. We would love
                to hear what catches your attention and what you want to see
                as we keep working on both games.
              </p>
              <div className="journal-article-actions">
                <a className="text-link" href="mailto:contact@imponix.com" data-track-placement="journal_desktop_feedback">
                  Share your thoughts <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>
          </article>
        </div>

        <section className="journal-article-footer">
          <div className="page-width">
            <p className="eyebrow eyebrow--blue">From our little studio</p>
            <h2>Find your next world.</h2>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Use browser navigation while Vinext's client Link handler is broken. */}
            <a className="text-link" href="/#games" data-track-placement="journal_desktop_footer">Explore our games <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
