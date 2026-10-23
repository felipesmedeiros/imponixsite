import type { Metadata } from "next";
import { DesktopPressKit } from "../../../components/DesktopPressKit";
import { createPageMetadata } from "../../../lib/seo";
import kit from "../../../../content/muchi/press-kit.json";

export const metadata: Metadata = createPageMetadata({
  path: "/games/muchi/press-kit",
  title: "Muchi Press Kit | Imponix Game Studio",
  description: "Official Muchi press kit: facts, descriptions, original screenshots, logos, and key art for the cozy free-to-play desktop pet. Coming to Windows in Q4 2026.",
  image: kit.keyArt.src,
  imageAlt: kit.keyArt.alt,
});

export default function MuchiPressKitPage() {
  return <DesktopPressKit kit={kit} />;
}
