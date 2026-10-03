import Image from "next/image";
import Link from "next/link";
import { T } from "./LanguageProvider";

const games = [
  { slug: "game-store-chronicle", name: "Game Store Chronicle", logo: "/games/gsc/menu-logo.png", width: 180, height: 180 },
  { slug: "noema", name: "NOEMA", logo: "/games/noema/library-logo.png", width: 800, height: 720 },
  { slug: "veil-of-shadows", name: "Veil of Shadows", logo: "/games/vos/menu-logo.png", width: 260, height: 194 },
  { slug: "photoncytosis", name: "Photoncytosis", logo: "/games/photoncytosis/logo-retrotronic.svg", width: 740, height: 236 },
] as const;

type OtherGamesProps = {
  currentGame: (typeof games)[number]["slug"];
};

export function OtherGames({ currentGame }: OtherGamesProps) {
  return (
    <nav className="other-games" aria-labelledby="other-games-title">
      <div className="other-games__inner page-width">
        <h2 id="other-games-title" className="other-games__heading"><T>Other worlds</T></h2>
        <ul className="other-games__list">
          {games.filter((game) => game.slug !== currentGame).map((game) => (
            <li key={game.slug}>
              <Link className="other-games__link" href={game.slug === "photoncytosis" ? "https://photon.imponix.com" : `/games/${game.slug}`}>
                <Image className="other-games__logo" src={game.logo} alt="" width={game.width} height={game.height} unoptimized />
                <span className="other-games__name">{game.name}</span>
                <span className="other-games__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
