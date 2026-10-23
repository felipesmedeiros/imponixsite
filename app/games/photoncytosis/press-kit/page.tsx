import type { Metadata } from "next";
import { DesktopPressKit } from "../../../components/DesktopPressKit";
import { createPageMetadata } from "../../../lib/seo";
import kit from "../../../../content/photoncytosis/press-kit.json";

export const metadata: Metadata = createPageMetadata({
  path: "/games/photoncytosis/press-kit",
  title: "Photoncytosis Press Kit | Imponix Game Studio",
  description: "Official Photoncytosis press kit: facts, descriptions, original screenshots, logos, key art, and teaser for the desktop life simulation. Demo available; full game planned for Q1 2027.",
  image: kit.keyArt.src,
  imageAlt: kit.keyArt.alt,
});

export default function PhotoncytosisPressKitPage() {
  return <DesktopPressKit kit={kit} />;
}
