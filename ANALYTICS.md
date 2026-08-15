# Imponix site analytics

The site records privacy-friendly, first-party events through the
`ANALYTICS_ENGINE` binding in the Cloudflare Workers Analytics Engine dataset
`Imponix_Website`. It does not set cookies or store
visitor identifiers.

## Recorded fields

| Field | Analytics Engine column | Example |
| --- | --- | --- |
| Event | `blob1` | `mod_tool_download` |
| Page path | `blob2` | `/games/game-store-chronicle` |
| Game | `blob3` | `gsc`, `vos`, or `studio` |
| Placement | `blob4` | `hero`, `details`, `review_prompt` |
| Button/link label | `blob5` | `Download GSC Mod Studio 0.2.0` |
| Destination category | `blob6` | `r2_download`, `steam`, `discord` |
| Count | `double1` | `1` |

The sampling key in `index1` is the website hostname.

## Recorded event names

- `page_view`
- `mod_tool_download`
- `steam_store_click`
- `steam_review_click`
- `discord_click`
- `press_kit_click`
- `contact_click`
- `social_click`
- `cta_click`

## Useful queries

GSC Mod Studio downloads by page over the last 30 days:

```sql
SELECT
  blob2 AS page,
  SUM(_sample_interval * double1) AS downloads
FROM Imponix_Website
WHERE
  timestamp >= NOW() - INTERVAL '30' DAY
  AND blob1 = 'mod_tool_download'
GROUP BY page
ORDER BY downloads DESC
```

All important actions over the last 30 days:

```sql
SELECT
  blob1 AS event,
  blob3 AS game,
  blob4 AS placement,
  blob5 AS label,
  SUM(_sample_interval * double1) AS clicks
FROM Imponix_Website
WHERE
  timestamp >= NOW() - INTERVAL '30' DAY
  AND blob1 != 'page_view'
GROUP BY event, game, placement, label
ORDER BY clicks DESC
```

Page views over the last 30 days:

```sql
SELECT
  blob2 AS page,
  SUM(_sample_interval * double1) AS views
FROM Imponix_Website
WHERE
  timestamp >= NOW() - INTERVAL '30' DAY
  AND blob1 = 'page_view'
GROUP BY page
ORDER BY views DESC
```

Cloudflare creates the dataset automatically after the deployed Worker writes
its first event. Query it through the Workers Analytics Engine SQL API using an
API token with `Account Analytics: Read` permission.
