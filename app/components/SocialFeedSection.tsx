import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { T } from "./LanguageProvider";

const youtubeChannelUrl = "https://www.youtube.com/@Imponix";
const tiktokProfileUrl = "https://www.tiktok.com/@imponixgames";
const youtubeFeedUrl =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UC172-GTwAfeTVIzeHFANxcg";

// Keep localized NOEMA trailer uploads off the English-facing site feed. They
// remain available on YouTube and can still be linked directly when needed.
const excludedVideoIds = new Set(["ztbmWU9SkHg", "yDMEpxmxDtM"]);

type YouTubeVideo = {
  href: string;
  id: string;
  isShort: boolean;
  published: string;
  title: string;
};

const fallbackVideos: YouTubeVideo[] = [
  {
    href: "https://www.youtube.com/watch?v=N-IJlV005Vc",
    id: "N-IJlV005Vc",
    isShort: false,
    published: "2026-09-16",
    title: "NOEMA - Announcement Trailer",
  },
  {
    href: "https://www.youtube.com/watch?v=_vDmZJWeASM",
    id: "_vDmZJWeASM",
    isShort: false,
    published: "2026-09-12",
    title: "Arcade Rentals Are Here! 🕹️ | Game Store Chronicle Update 1.2.6",
  },
  {
    href: "https://www.youtube.com/watch?v=19gC-3mToZQ",
    id: "19gC-3mToZQ",
    isShort: false,
    published: "2026-09-05",
    title: "Game Store Chronicle – Trade-Ins & Pre-Owned Games | 1.2.5 Trailer",
  },
];

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readTag(entry: string, tag: string) {
  return entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? "";
}

function parseYouTubeFeed(xml: string) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

  return entries
    .map((match) => {
      const entry = match[1];
      const id = readTag(entry, "yt:videoId");
      const title = decodeXml(readTag(entry, "title"));
      const published = readTag(entry, "published").slice(0, 10);
      const href = decodeXml(
        entry.match(/<link\s+rel="alternate"\s+href="([^"]+)"\s*\/?\s*>/)?.[1] ?? "",
      );

      if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !title || !href) return null;
      return {
        href,
        id,
        isShort: href.includes("youtube.com/shorts/") || /#shorts?\b/i.test(title),
        published,
        title,
      };
    })
    .filter((video): video is YouTubeVideo => video !== null)
    .slice(0, 12);
}

function isShort(video: YouTubeVideo) {
  return video.isShort;
}

async function getLatestVideos() {
  try {
    const response = await fetch(youtubeFeedUrl, {
      headers: { Accept: "application/atom+xml, application/xml;q=0.9" },
      next: { revalidate: 3600 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) return fallbackVideos;
    const videos = parseYouTubeFeed(await response.text()).filter(
      (video) => !excludedVideoIds.has(video.id),
    );
    return [...videos, ...fallbackVideos].filter(
      (video, index, allVideos) =>
        allVideos.findIndex((candidate) => candidate.id === video.id) === index,
    ).sort((left, right) => right.published.localeCompare(left.published));
  } catch {
    return fallbackVideos;
  }
}

function VideoCard({ video, variant }: { video: YouTubeVideo; variant: "featured" | "compact" }) {
  return (
    <a
      className={`social-feed__card social-feed__card--${variant}`}
      data-track-placement="home_social_feed"
      href={video.href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="social-feed__media">
        <img
          alt=""
          decoding="async"
          loading="lazy"
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        />
        <span className="social-feed__play" aria-hidden="true">▶</span>
        <span className="social-feed__network">YouTube</span>
      </span>
      <span className="social-feed__copy">
        <time dateTime={video.published}>{video.published}</time>
        <strong>{video.title}</strong>
        <span><T>Watch on YouTube</T> <ExternalLinkIcon /></span>
      </span>
    </a>
  );
}

export async function SocialFeedSection() {
  const videos = await getLatestVideos();
  const regularVideos = videos.filter((video) => !isShort(video));
  const featuredVideo = regularVideos[0] ?? fallbackVideos[0];
  const moreVideos = regularVideos.slice(1, 3);

  return (
    <section className="social-feed" id="social" aria-labelledby="social-feed-title">
      <div className="social-feed__grid-pattern" aria-hidden="true" />
      <div className="page-width social-feed__inner">
        <div className="section-heading section-heading--split social-feed__heading">
          <div>
            <p className="eyebrow eyebrow--blue"><T>Latest from Imponix</T></p>
            <h2 id="social-feed-title"><T>Watch, follow, repeat.</T></h2>
          </div>
          <p><T>The newest videos from our tiny studio—development signals, update previews, and whatever escaped the build.</T></p>
        </div>

        <div className="social-feed__layout">
          <div className="social-feed__group social-feed__group--featured">
            <p className="social-feed__group-label"><T>Latest video</T></p>
            <VideoCard video={featuredVideo} variant="featured" />
          </div>
          <div className="social-feed__group social-feed__group--more">
            <p className="social-feed__group-label"><T>More videos</T></p>
            <div className="social-feed__more">
              {moreVideos.map((video) => (
                <VideoCard key={video.id} video={video} variant="compact" />
              ))}
            </div>
          </div>
        </div>

        <div className="social-feed__channels" aria-label="Imponix social channels">
          <a
            className="button button--outline social-feed__channel social-feed__channel--youtube"
            data-track-label="Visit our YouTube channel"
            data-track-placement="home_social_feed"
            href={youtubeChannelUrl}
            rel="noreferrer"
            target="_blank"
          >
            <T>Visit our YouTube channel</T> <ExternalLinkIcon />
          </a>
          <a
            className="button button--outline social-feed__channel social-feed__channel--tiktok"
            data-track-label="Follow @imponixgames on TikTok"
            data-track-placement="home_social_feed"
            href={tiktokProfileUrl}
            rel="noreferrer"
            target="_blank"
          >
            <T>Follow @imponixgames on TikTok</T> <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
