import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { T } from "./LanguageProvider";

const youtubeChannelUrl = "https://www.youtube.com/@Imponix";
const tiktokProfileUrl = "https://www.tiktok.com/@imponixgames";
const youtubeFeedUrl =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UC172-GTwAfeTVIzeHFANxcg";

type YouTubeVideo = {
  id: string;
  published: string;
  title: string;
};

const fallbackVideos: YouTubeVideo[] = [
  {
    id: "ZXAACjoYY7o",
    published: "2026-09-15",
    title: "This message was not for you. | NOEMA — Second Signal #Shorts",
  },
  {
    id: "m7j1x4bdvuU",
    published: "2026-09-15",
    title: "When did this become normal? | NOEMA — Official Teaser #Shorts",
  },
  {
    id: "_vDmZJWeASM",
    published: "2026-09-12",
    title: "Arcade Rentals Are Here! 🕹️ | Game Store Chronicle Update 1.2.6",
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

      if (!/^[A-Za-z0-9_-]{11}$/.test(id) || !title) return null;
      return { id, published, title };
    })
    .filter((video): video is YouTubeVideo => video !== null)
    .slice(0, 12);
}

function isShort(video: YouTubeVideo) {
  return /#shorts?\b/i.test(video.title);
}

async function getLatestVideos() {
  try {
    const response = await fetch(youtubeFeedUrl, {
      headers: { Accept: "application/atom+xml, application/xml;q=0.9" },
      next: { revalidate: 3600 },
    } as RequestInit & { next: { revalidate: number } });

    if (!response.ok) return fallbackVideos;
    const videos = parseYouTubeFeed(await response.text());
    return [...videos, ...fallbackVideos].filter(
      (video, index, allVideos) =>
        allVideos.findIndex((candidate) => candidate.id === video.id) === index,
    );
  } catch {
    return fallbackVideos;
  }
}

function VideoCard({ video, variant }: { video: YouTubeVideo; variant: "featured" | "short" }) {
  return (
    <a
      className={`social-feed__card social-feed__card--${variant}`}
      data-track-placement="home_social_feed"
      href={`https://www.youtube.com/watch?v=${video.id}`}
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
        <span className="social-feed__network">{variant === "short" ? "YouTube Short" : "YouTube"}</span>
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
  const featuredVideo = videos.find((video) => !isShort(video)) ?? videos[0];
  const shortVideos = videos
    .filter((video) => isShort(video) && video.id !== featuredVideo.id)
    .slice(0, 2);

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
          <div className="social-feed__group social-feed__group--shorts">
            <p className="social-feed__group-label"><T>Latest Shorts</T></p>
            <div className="social-feed__shorts">
              {shortVideos.map((video) => (
                <VideoCard key={video.id} video={video} variant="short" />
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
