import { createPageMetadata } from "../../../lib/seo";
import document from "../../../../public/games/my-world/legal/2026-11-19/terms.json";
import { MyWorldLegalPage } from "../LegalPage";

export const metadata = createPageMetadata({
  path: "/games/my-world/terms-and-conditions",
  title: "My World Terms and Conditions | Imponix Game Studio",
  description: "Terms for the My World game, accounts, and multiplayer services.",
});

export default function Page() {
  return <MyWorldLegalPage document={document} />;
}
