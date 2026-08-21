# Imponix Website Agent Guide

## Imponix news-post skill

Use the personal Codex skill `create-imponix-news-post` whenever a request creates, updates, or republishes game news for the Imponix website. This includes development previews, release announcements, patch notes, update summaries, community posts, news-hub cards, article hero images, and revisions to release wording.

The skill is installed at:

`C:/Users/felip/.codex/skills/create-imponix-news-post/SKILL.md`

Before changing a news post:

1. Read the complete skill instructions and its required `references/post-format.md` reference.
2. Read the target game's page, its current news-card data, and the closest existing news article.
3. Use user-provided notes and media as the primary factual sources. Browse only when requested or when local sources are insufficient.
4. Preserve the site's Vinext architecture, shared header and footer, analytics, visual language, and unrelated user changes.

Follow the established article workflow:

- Use `app/games/<game-slug>/news/<post-slug>/page.tsx` for the article route.
- Put parsed article copy in `content/<game-slug>/<post-slug>.md` when using the established Markdown section-and-bullet format.
- Use the Game Store Chronicle 1.2.0 preview article as the canonical visual and structural reference.
- Give every article its own title, description, Open Graph fields, X fields, hero image, and accurate alt text.
- Add a new article as the first card on the game's news hub and normally retain the latest three cards.
- Preserve global analytics so article page views and tracked calls to action continue to be recorded.

For unreleased updates, keep all planned features in future tense and clearly distinguish pre-release availability from the planned official release. Never claim unsupported features, dates, platforms, or release states.

Validate post work with `git diff --check`, a production build, and a successful local response from the article route. Restart the development server after changing raw Markdown imports when necessary. Perform visual browser QA only when requested.

Keep news-post changes local for approval by default. Do not commit or push until the user explicitly authorizes it, and then stage only the post-related files.

## Imponix game-review update skill

Use the personal Codex skill `update-imponix-game-reviews` whenever player-review cards are refreshed for GSC, VoS, or another Imponix game.

The skill is installed at:

`C:/Users/felip/.codex/skills/update-imponix-game-reviews/SKILL.md`

It retrieves short, attributed positive reviews from Steam using the target game's App ID, updates only that game's `PlayerReviewsSection` data, preserves Steam review analytics, validates the local build, and keeps the changes local until explicitly approved for commit or push.

## GSC Mod Studio update skill

Use the personal Codex skill `update-gsc-mod-tool` whenever the current public GSC Mod Studio download must be updated. It accepts exactly two inputs: the new version and the public HTTPS ZIP URL.

The skill is installed at:

`C:/Users/felip/.codex/skills/update-gsc-mod-tool/SKILL.md`

The skill updates the homepage and GSC game-page links, visible and accessibility version labels, analytics documentation, and explicit download-event tracking. It must not rewrite historical news or patch-note references. Keep its changes local until the user explicitly authorizes a commit or push.
