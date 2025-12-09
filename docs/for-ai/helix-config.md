# Helix Configuration Reference for allabout.network

## Document Purpose

This document explains the `.helix/config` file for the allabout.network project, detailing each configuration key and its purpose in the Adobe Edge Delivery Services (EDS) setup.

**Last Updated:** 9 December 2025
**Configuration Status:** Active and operational
**File Location:** `.helix/config` (Google Sheets format)

---

## What is .helix/config?

The `.helix/config` file is the **central configuration** for Adobe Edge Delivery Services projects. It controls:

- CDN integration and routing
- Push invalidation setup
- Environment hostnames (preview, live, production)
- Custom domain configuration
- Access control and permissions

**Format:** Two-column table with `key` and `value` columns (stored as `.helix/config.xlsx` for SharePoint or `.helix/config` for Google Sheets)

**Activation:** Changes require publishing via Adobe Sidekick to become active

---

## Why Helix Config Matters

### Without This Configuration
- Custom domains won't work with Adobe EDS
- Push invalidation won't clear CDN caches on publish
- Preview and production environments won't be separated
- Cloudflare CDN integration won't function

### With Proper Configuration
- ✅ Custom domain (`allabout.network`) works seamlessly
- ✅ Publishing content automatically clears Cloudflare cache
- ✅ Preview environment isolated from production
- ✅ Cloudflare acts as production CDN in front of Adobe's Fastly

---

## Current Configuration Breakdown

### Core Project Settings

| Key | Value | Purpose |
|-----|-------|---------|
| **name** | `Helix website` | Project identifier used by Adobe services and Slack bot for notifications |
| **host** | `allabout.network` | Production hostname displayed in Slack bot info and used for content delivery |

**Why these matter:**
- `name` helps identify the project in Adobe's admin tools
- `host` defines the primary production domain

---

### CDN Production Configuration

| Key | Value | Purpose |
|-----|-------|---------|
| **cdn.prod.type** | `cloudflare` | Specifies Cloudflare as the production CDN vendor |
| **cdn.prod.host** | `allabout.network` | Production domain that visitors access |
| **cdn.prod.route** | `/` | All routes from root path use Adobe EDS (entire site) |

**Why these matter:**
- `cdn.prod.type` tells Adobe EDS that Cloudflare is in front of their CDN
- `cdn.prod.host` defines the production domain for custom domain setup
- `cdn.prod.route = /` means entire site goes through Adobe EDS (not just specific paths)

**Technical note:** This creates a **double CDN architecture**:
```
Visitor → Cloudflare CDN → Cloudflare Worker → Adobe Fastly CDN → Adobe EDS Origin
```

---

### Cloudflare Integration Credentials

| Key | Value | Purpose |
|-----|-------|---------|
| **cloudflare.apiToken** | `HHcnZf4ayJXWDxoG-jmAu9ALKSS8PXqyUEuW-H4Xv` | API token for Cloudflare cache purging |
| **cloudflare.zoneId** | `0d25478d3c5849d527b97777dc7f6b0e` | Cloudflare zone identifier for allabout.network |

**Why these matter:**
- Enable **push invalidation** (automatic cache clearing on publish)
- Allow Adobe EDS to communicate with Cloudflare API
- Required for "Purge Everything" functionality to work

**Security:**
- Token has minimum permissions (Cache Purge only)
- Scoped to specific zone only (not all zones)
- Should be rotated annually

**How push invalidation works:**
1. Content published via Sidekick
2. Adobe EDS calls Cloudflare API using these credentials
3. Cloudflare purges entire site cache (Free plan behavior)
4. Next visitor gets fresh content from origin
5. Content re-caches automatically

---

### Environment Hostnames

| Key | Value | Purpose |
|-----|-------|---------|
| **cdn.preview.host** | `main--allaboutv2--ddttom.aem.page` | Preview environment for draft content |
| **cdn.live.host** | `main--allaboutv2--ddttom.aem.live` | Live/published environment on Adobe's CDN |

**Why these matter:**
- **Preview** (`.aem.page`): Draft content visible only to editors before publishing
- **Live** (`.aem.live`): Published content on Adobe's CDN, proxied through Cloudflare for production
- Separates authoring workflow from public-facing content

**Environment hierarchy:**
```
Preview Environment:     main--allaboutv2--ddttom.aem.page     (Draft)
                                      ↓ [Publish]
Live Environment:        main--allaboutv2--ddttom.aem.live     (Published on Adobe CDN)
                                      ↓ [Cloudflare Proxy]
Production Environment:  allabout.network                      (Public via Cloudflare)
```

---

## Configuration Key Reference

### Required Keys (Must Have)

| Key | Data Type | Example | Required? |
|-----|-----------|---------|-----------|
| `name` | String | `Helix website` | ✅ Yes |
| `host` | String | `allabout.network` | ✅ Yes |
| `cdn.prod.type` | String | `cloudflare` | ✅ Yes (for BYO CDN) |
| `cdn.prod.host` | String | `allabout.network` | ✅ Yes (for BYO CDN) |
| `cloudflare.apiToken` | String | `[secure token]` | ✅ Yes (for push invalidation) |
| `cloudflare.zoneId` | String | `[zone ID]` | ✅ Yes (for push invalidation) |
| `cdn.preview.host` | String | `main--repo--owner.aem.page` | ✅ Yes |

### Optional Keys (Recommended)

| Key | Data Type | Example | Purpose |
|-----|-----------|---------|---------|
| `cdn.prod.route` | String | `/` or `/site` | Specify which routes use EDS |
| `cdn.live.host` | String | `main--repo--owner.aem.live` | Explicit live environment hostname |
| `access.allow` | String | `*@example.com` | Email glob for authorized users |
| `admin.role.publish` | String | `*@example.com` | Control publish permissions |

### CDN Vendor-Specific Keys

**Cloudflare:**
- `cloudflare.apiToken`
- `cloudflare.zoneId`

**Fastly:**
- `cdn.prod.serviceId`
- `cdn.prod.authToken`

**Akamai:**
- `cdn.prod.endpoint`
- `cdn.prod.clientSecret`
- `cdn.prod.clientToken`
- `cdn.prod.accessToken`

---

## Configuration Breakdown: Why Each Key

### 1. Project Identity

```
name = Helix website
host = allabout.network
```

**Purpose:** Identifies the project in Adobe's systems and defines the primary production domain.

**Impact:**
- Used in admin notifications
- Displayed in monitoring dashboards
- Referenced in logs and support tickets

---

### 2. CDN Production Setup

```
cdn.prod.type = cloudflare
cdn.prod.host = allabout.network
cdn.prod.route = /
```

**Purpose:** Configures Cloudflare as the production CDN in front of Adobe EDS.

**Why this architecture?**
- **Performance:** Cloudflare's 300+ edge locations serve cached content globally
- **Security:** Cloudflare provides DDoS protection and Web Application Firewall
- **Control:** You control cache rules, security settings, and DNS
- **Cost:** Cloudflare Free plan provides unlimited bandwidth

**Double CDN is normal:**
- Cloudflare caches static assets and HTML
- Adobe Fastly serves as origin CDN
- Cloudflare Worker rewrites Host header to route to Adobe EDS

---

### 3. Push Invalidation Credentials

```
cloudflare.apiToken = [secure token]
cloudflare.zoneId = [zone ID]
```

**Purpose:** Enables automatic cache clearing when content is published.

**Without these:**
- Publishing content wouldn't clear Cloudflare cache
- Visitors would see stale content until cache expires
- Manual "Purge Everything" required after each publish

**With these:**
- Publish button clears cache automatically
- Fresh content appears within 5-10 seconds
- Seamless authoring workflow

**Security best practices:**
- Token has minimum permissions (Cache Purge only)
- Token scoped to single zone (not account-wide)
- Rotate token annually
- Never commit token to public repositories

---

### 4. Environment Separation

```
cdn.preview.host = main--allaboutv2--ddttom.aem.page
cdn.live.host = main--allaboutv2--ddttom.aem.live
```

**Purpose:** Separate preview/draft content from published content.

**Preview environment (`.aem.page`):**
- Authors see changes before publishing
- Not indexed by search engines
- Requires authentication (if configured)
- Instant updates without publishing

**Live environment (`.aem.live`):**
- Published content on Adobe's CDN
- Publicly accessible (unless authentication enabled)
- Source for production domain via Cloudflare proxy

**Why separate environments matter:**
- Safe testing before going live
- Multiple authors can preview different branches
- Production remains stable during development

---

### 5. Route Configuration

```
cdn.prod.route = /
```

**Purpose:** Defines which URL paths use Adobe EDS.

**Options:**
- `/` - Entire site (recommended for most projects)
- `/blog` - Only blog section
- `/site` - Only /site/ path
- Multiple paths can be comma-separated

**Why we use `/`:**
- Entire allabout.network site is built with Adobe EDS
- No mixed architecture (EDS + other CMS)
- Simpler configuration and debugging

**When to use specific paths:**
- Migrating from another CMS incrementally
- Different CMS for different sections
- Hybrid architecture with multiple backends

---

## How Configuration Changes Work

### Making Changes

1. **Edit the file:** Update `.helix/config` in Google Sheets or SharePoint
2. **Preview changes:** Test using Sidekick preview
3. **Publish config:** Use Sidekick "Publish" button
4. **Wait for propagation:** Changes take effect within 1-2 minutes
5. **Verify:** Test that configuration changes are active

### Testing Configuration

**Verify CDN integration:**
```bash
curl -I https://allabout.network | grep -E "(server|cf-cache-status|x-served-by)"
```

**Expected response:**
```
server: cloudflare                    (Cloudflare CDN)
cf-cache-status: HIT                  (Cached by Cloudflare)
x-served-by: cache-lga21965           (Adobe Fastly backend)
```

**Verify push invalidation:**
1. Note current cache status: `curl -I https://allabout.network | grep cf-cache-status`
2. Publish any content via Sidekick
3. Wait 10 seconds
4. Check cache status again: Should show `MISS` (cache was purged)
5. Second request: Should show `HIT` (newly cached)

Or use Adobe's validation tool: https://www.aem.live/tools/cdn-validator

---

## Common Configuration Issues

### Issue 1: Push Invalidation Not Working

**Symptoms:**
- Content doesn't update after publishing
- Old content still showing hours after publish
- Manual "Purge Everything" required

**Check:**
```bash
# Test if Cloudflare credentials are valid
curl -X GET "https://api.cloudflare.com/client/v4/zones/0d25478d3c5849d527b97777dc7f6b0e" \
  -H "Authorization: Bearer HHcnZf4ayJXWDxoG-jmAu9ALKSS8PXqyUEuW-H4Xv"
```

**Solutions:**
- Verify `cloudflare.apiToken` is still valid (not expired/revoked)
- Verify `cloudflare.zoneId` matches your Cloudflare dashboard
- Ensure config has been published via Sidekick
- Check Cloudflare Worker has `PUSH_INVALIDATION=enabled`

---

### Issue 2: Custom Domain Not Working

**Symptoms:**
- `allabout.network` doesn't load
- Works on `.aem.live` but not custom domain
- Certificate errors or 521/522 errors

**Check:**
```bash
dig allabout.network +short
# Should return Cloudflare IPs (104.x.x.x or 172.x.x.x)

curl -I https://allabout.network
# Should return 200 OK with cloudflare server header
```

**Solutions:**
- Verify DNS CNAME points to Adobe EDS origin
- Ensure DNS is proxied (orange cloud) in Cloudflare
- Check `cdn.prod.host` matches your domain exactly
- Verify Cloudflare Worker is active on routes

---

### Issue 3: Wrong Content Cached

**Symptoms:**
- Homepage shows different application (e.g., AI Chat)
- Subdirectories work but root doesn't
- Headers show cached content but wrong origin

**Solutions:**
1. **Purge cache immediately:** Cloudflare Dashboard → Caching → Purge Everything
2. **Check for conflicting deployments:** Cloudflare Pages deployment on same domain
3. **Verify worker routes:** Only `aem-worker` should handle `allabout.network/*`
4. **Check worker code:** Ensure using Adobe's official worker code

---

## Configuration Best Practices

### Security

✅ **Do:**
- Keep API tokens with minimum necessary permissions
- Rotate credentials annually
- Store tokens securely (never in public repos)
- Use specific zone IDs (not account-wide)
- Document token creation date and purpose

❌ **Don't:**
- Share API tokens publicly
- Use tokens with excessive permissions
- Hard-code tokens in application code
- Use same token for multiple environments

---

### Maintenance

✅ **Do:**
- Document all configuration changes
- Test changes in preview before publishing
- Keep backup of working configuration
- Monitor push invalidation after config changes
- Review configuration quarterly

❌ **Don't:**
- Make config changes without testing
- Skip publishing config after changes
- Assume changes are instant (allow 1-2 min propagation)
- Delete required keys

---

### Performance

✅ **Do:**
- Use `cdn.prod.route = /` for entire site
- Enable push invalidation for instant updates
- Monitor cache hit ratio (aim for 70%+)
- Keep Cloudflare cache rules simple

❌ **Don't:**
- Overly complex route patterns
- Frequent manual cache purging
- Disable push invalidation
- Mix multiple CDN configurations

---

## Advanced Configuration Options

### Access Control

Add email-based access control:

```
access.allow = *@digitaldomaintechnologies.com
admin.role.publish = tom.cranstoun@gmail.com
```

**Purpose:** Restrict who can view/publish content

---

### Multiple Routes

Serve different paths from different sources:

```
cdn.prod.route = /blog,/docs
```

**Purpose:** Hybrid architecture with EDS for specific sections

---

### Custom Headers

Create `.helix/headers` file for HTTP security headers:

```
/*
  Content-Security-Policy: default-src 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

**Purpose:** Enhanced security without config changes

---

### URL Redirects

Create `.helix/redirects` file for URL rewrites:

```
/old-page.html  /new-page  301
/blog/*         /blogs/:splat  301
```

**Purpose:** Handle URL migrations and redirects

---

## Configuration Validation Checklist

Use this checklist to verify configuration is correct:

### Required Configuration
- [ ] `name` - Project name present
- [ ] `host` - Production domain set
- [ ] `cdn.prod.type = cloudflare` - CDN vendor specified
- [ ] `cdn.prod.host` - Production domain matches `host`
- [ ] `cloudflare.apiToken` - Valid API token configured
- [ ] `cloudflare.zoneId` - Correct zone ID from Cloudflare
- [ ] `cdn.preview.host` - Preview environment hostname (`.aem.page`)

### Optional But Recommended
- [ ] `cdn.prod.route = /` - Explicit route configuration
- [ ] `cdn.live.host` - Live environment hostname (`.aem.live`)
- [ ] Config published via Sidekick
- [ ] Push invalidation tested and working

### Integration Verification
- [ ] DNS points to Cloudflare (orange cloud enabled)
- [ ] Cloudflare Worker active on correct routes
- [ ] Worker has correct `ORIGIN_HOSTNAME` environment variable
- [ ] Worker has `PUSH_INVALIDATION=enabled`
- [ ] Site loads at production domain
- [ ] Headers show both Cloudflare and Adobe/Fastly
- [ ] Publishing workflow clears cache automatically

---

## Related Configuration Files

### .helix/headers (Optional)
Custom HTTP headers for security and performance

**Location:** `.helix/headers`
**Format:** Netlify-style headers file
**Purpose:** Add CSP, HSTS, CORS, caching headers

---

### .helix/redirects (Optional)
URL rewrite and redirect rules

**Location:** `.helix/redirects`
**Format:** Netlify-style redirects file
**Purpose:** Handle URL migrations, canonical URLs, redirects

---

### helix-sitemap.yaml (Optional)
Sitemap generation configuration

**Location:** `helix-sitemap.yaml` (root directory)
**Format:** YAML
**Purpose:** Generate `sitemap.xml` from `query-index.json`

---

## Configuration Service API (Advanced)

For programmatic configuration management, use Adobe's Configuration Service API:

**Base URL:** `https://admin.hlx.page/config/{org}/sites/{site}`

**Example: Update CDN Production Config**
```bash
curl -X POST https://admin.hlx.page/config/ddttom/sites/allaboutv2/cdn/prod.json \
  -H 'content-type: application/json' \
  -H 'x-auth-token: {your-auth-token}' \
  --data '{
    "host": "allabout.network",
    "type": "cloudflare",
    "apiToken": "{token}",
    "zoneId": "{zone}"
  }'
```

**When to use:**
- Automated deployments
- Multiple environment management
- Configuration as code workflows
- CI/CD integration

---

## Troubleshooting Resources

### Adobe EDS Documentation
- **Configuration Reference:** https://www.aem.live/docs/configuration
- **Cloudflare Setup Guide:** https://www.aem.live/docs/byo-cdn-cloudflare-worker-setup
- **Push Invalidation Setup:** https://www.aem.live/docs/setup-byo-cdn-push-invalidation
- **CDN Validator Tool:** https://www.aem.live/tools/cdn-validator

### Project Documentation
- **Cloudflare Setup:** [docs/for-ai/implementation/cloudflare.md](cloudflare.md)
- **EDS Architecture:** [docs/for-ai/implementation/eds-architecture-standards.md](implementation/eds-architecture-standards.md)
- **Security Checklist:** [docs/for-ai/guidelines/security-checklist.md](guidelines/security-checklist.md)

### Support Channels
- **Adobe EDS Discord:** https://discord.gg/aem-live
- **Cloudflare Community:** https://community.cloudflare.com/
- **Adobe Status Page:** https://status.adobe.com/products/503489

---

## Document Maintenance

**Owner:** Tom Cranstoun
**Created:** 9 December 2025
**Last Updated:** 9 December 2025
**Review Schedule:** Quarterly or after configuration changes
**Version:** 1.0

**Update this document when:**
- Configuration keys are added or modified
- New CDN vendor integrated
- Push invalidation setup changes
- Access control requirements change
- Security credentials rotated

---

## Summary

The `.helix/config` file is essential for:
- ✅ Custom domain integration with Adobe EDS
- ✅ Cloudflare CDN configuration and push invalidation
- ✅ Environment separation (preview, live, production)
- ✅ Automated cache clearing on publish
- ✅ Secure credential management

**Your configuration is complete and correct** - all required keys are present and properly configured for the double CDN architecture (Cloudflare → Adobe EDS).

---

## End of Document
