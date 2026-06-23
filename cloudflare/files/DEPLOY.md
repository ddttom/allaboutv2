---
title: "Cloudflare Worker Deploy Procedure"
description: "Manual, human-in-the-loop deploy steps for the allabout.network Cloudflare worker."
author: Tom Cranstoun
created: "2026-05-04"
modified: "2026-05-04"
version: "1.0"

type: doc
mx:
  status: active
  audience: [tech]
  canonicalUri: https://raw.githubusercontent.com/ddttom/allaboutv2/main/cloudflare/files/DEPLOY.md

---

# Cloudflare Worker Deploy

**Policy:** This worker is deployed manually. There is no CI pipeline for Cloudflare worker deploys, by design. The previous `deploy-cloudflare.yml` GitHub Actions workflow was removed on 2026-05-04. Every deploy must be a deliberate human action so the engineer running it can verify behaviour live before walking away.

## Procedure

From this directory (`allaboutv2/cloudflare/files/`):

```bash
# 0. Guard: ensure deprecated CF_API_TOKEN is not exported in your shell.
#    If it is, it overrides Wrangler's OAuth token and deploy fails with
#    authentication error [code: 10000].
if [ -n "${CF_API_TOKEN}" ]; then
  echo "⚠️  CF_API_TOKEN is set — this overrides Wrangler's OAuth token."
  echo "   Run: unset CF_API_TOKEN  (and remove it from ~/.zshrc)"
  exit 1
fi

# 1. Run tests first — same gate the workflow used.
npm test

# 2. Deploy via wrangler. Wrangler reads the OAuth token from
#    ~/Library/Preferences/.wrangler/config/default.toml (macOS) or
#    ~/.config/.wrangler/config/default.toml (Linux). If you do not
#    have one, run `npx wrangler login` first — it opens a browser.
npx wrangler@latest deploy

# 3. Verify live behaviour with curl. The minimum smoke set:
curl -sI https://allabout.network/                          # 200, cfw header bumped
curl -sI https://mx.allabout.network/.well-known/llms.txt   # 200
curl -sI https://mx.allabout.network/.well-known/llms-full.txt  # 200

# 4. Purge the Cloudflare cache so visitors see the new worker output.
ZONE_ID="0d25478d3c5849d527b97777dc7f6b0e"
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_PURGE_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## Why no CI?

Cloudflare worker behaviour can change in subtle ways that only show up under live traffic — header rewrites, cache interactions, edge-runtime quirks, downstream fetches against an origin that may itself have changed. A green test suite is necessary but not sufficient. The engineer pressing the deploy button needs to be the same person who curls the live site one minute later, sees the actual response, and rolls back if it looks wrong. Automating that step away costs more than it saves.

If the deploy is more complex than a single `npx wrangler deploy` (e.g. needs new bindings, secrets, a route change, a wrangler.toml edit), pause and write down what you are about to do before running anything.

## Rollback

Cloudflare keeps every deployed version. To roll back:

```bash
# List recent versions
npx wrangler@latest versions list

# Promote a previous version to 100% traffic
npx wrangler@latest versions deploy <VERSION_ID>@100%
```

Or use the Cloudflare dashboard at <https://dash.cloudflare.com/> → Workers & Pages → cool-cell-c75e → Deployments → "Rollback".
