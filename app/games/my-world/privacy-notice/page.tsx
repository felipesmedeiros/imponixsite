import { createPageMetadata } from "../../../lib/seo";
import document from "../../../../public/games/my-world/legal/2026-11-19/privacy.json";
import { MyWorldLegalPage } from "../LegalPage";

export const metadata = createPageMetadata({
  path: "/games/my-world/privacy-notice",
  title: "My World Privacy Notice | Imponix Game Studio",
  description: "How Imponix Game Studio handles personal information for My World.",
});

export default function Page() {
  return <MyWorldLegalPage document={document} />;
}
