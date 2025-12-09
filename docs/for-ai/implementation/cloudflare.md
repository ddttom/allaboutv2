# allabout.network Cloudflare Configuration Reference

## Document Purpose

This document serves as a knowledge base for AI assistants helping with allabout.network. 
It contains the complete current Cloudflare CDN configuration, Adobe Edge Delivery Services integration, and operational details.

**Last Updated:** 9 December 2025  
**Configuration Status:** Active and operational

---

## Domain Overview

**Domain:** allabout.network  
**Registrar:** GoDaddy  
**DNS Management:** Cloudflare  
**Primary Purpose:** Personal/professional website powered by Adobe Edge Delivery Services  
**Owner:** Tom Cranstoun (Principal Consultant, Digital Domain Technologies Ltd)

---

## Current Architecture

```
┌─────────────┐
│   Visitor   │
└──────┬──────┘
       │ HTTPS (443)
       ▼
┌─────────────────────────────────┐
│  Cloudflare Global Network      │
│  - Edge locations worldwide     │
│  - SSL termination              │
│  - DDoS protection              │
│  - CDN caching                  │
└──────┬──────────────────────────┘
       │
       │ Cloudflare Worker
       │ (aem-worker)
       │ - Host header rewrite
       │ - Push invalidation handler
       │
       ▼
┌─────────────────────────────────┐
│  Adobe Fastly CDN               │
│  (Adobe's backend infrastructure)│
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Adobe Edge Delivery Services   │
│  Origin: main--allaboutv2--     │
│  ddttom.aem.live                │
└─────────────────────────────────┘
```

**Mermaid Diagram** (for supporting viewers):

```mermaid
graph TD
    A[Visitor] -->|HTTPS:443| B[Cloudflare Global Network]
    B -->|Edge locations worldwide| C[Cloudflare Worker: aem-worker]
    C -->|Host header rewrite| D[Adobe Fastly CDN]
    D -->|Backend infrastructure| E[Adobe Edge Delivery Services]
    E -->|Origin| F[main--allaboutv2--ddttom.aem.live]

    style A fill:#e1f5ff
    style B fill:#f9a825
    style C fill:#ff9800
    style D fill:#7b1fa2
    style E fill:#d32f2f
    style F fill:#388e3c
```

**Key Points:**
- Double CDN architecture (Cloudflare → Adobe's Fastly)
- This is normal and expected for Adobe EDS
- Worker handles the routing between CDNs
- Both Cloudflare and Fastly headers will appear in responses

---

## Cloudflare Account Details

**Account:** tom.cranstoun@gmail.com  
**Plan:** Free  

### Nameservers

**Current:**
- angela.ns.cloudflare.com
- george.ns.cloudflare.com

---

## DNS Configuration

### Active DNS Records

| Type | Name | Target/Content | Proxy Status | TTL | Purpose |
|------|------|----------------|--------------|-----|---------|
| CNAME | @ | main--allaboutv2--ddttom.aem.live | Proxied (orange) | Auto | Apex domain |
| CNAME | www | main--allaboutv2--ddttom.aem.live | Proxied (orange) | Auto | WWW subdomain |

**Critical Settings:**
- Both records MUST be Proxied (orange cloud icon)
- Both point to same Adobe EDS origin
- No A records for web traffic (using CNAME)
- Auto TTL allows Cloudflare to optimise

**Important:** No email services are configured on this domain. If email is needed in future, MX and TXT records will need to be added.

---

## SSL/TLS Configuration

**Encryption Mode:** Full  
**Always Use HTTPS:** Enabled  
**Minimum TLS Version:** 1.2  
**Automatic HTTPS Rewrites:** Enabled  
**Certificate Type:** Cloudflare Universal SSL  

### Why Full (not Full strict)?

Adobe Edge Delivery Services uses Fastly's SSL certificates. These certificates don't specifically cover allabout.network, so Full (strict) mode causes certificate validation errors (HTTP 526).

**Full mode provides:**
- HTTPS encryption: Browser → Cloudflare ✓
- HTTPS encryption: Cloudflare → Origin ✓
- Certificate validation: Disabled (necessary for this setup)

**Security note:** Traffic is fully encrypted end-to-end. The lack of strict certificate validation is acceptable because Adobe EDS is a trusted origin.

---

## Cloudflare Worker Configuration

### Worker Details

**Worker Name:** aem-worker  
**Type:** Cloudflare Worker (JavaScript)  
**Code Source:** Adobe official repository  
**GitHub URL:** https://github.com/adobe/aem-cloudflare-prod-worker  
**Code URL:** https://raw.githubusercontent.com/adobe/aem-cloudflare-prod-worker/main/src/index.mjs  
**Status:** Active

### Environment Variables

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| ORIGIN_HOSTNAME | main--allaboutv2--ddttom.aem.live | Adobe EDS origin hostname |
| PUSH_INVALIDATION | enabled | Enable automatic cache clearing |

**Critical:** `ORIGIN_HOSTNAME` must match exactly the Adobe EDS hostname. No https://, no trailing slash.

### Worker Routes

| Route | Zone | Failure Mode |
|-------|------|--------------|
| allabout.network/* | allabout.network | Fail closed (block) |
| www.allabout.network/* | allabout.network | Fail closed (block) |

**Route Configuration:**
- Specific routes for apex and www (not wildcard)
- Wildcard routes (`*.allabout.network/*`) avoided for security and SEO
- Fail closed means errors block requests rather than bypass worker

### What the Worker Does

1. **Intercepts requests** to allabout.network and www.allabout.network
2. **Rewrites Host header** from `allabout.network` to `main--allaboutv2--ddttom.aem.live`
3. **Forwards request** to Adobe Edge Delivery Services
4. **Handles responses** including caching headers
5. **Processes push invalidation** requests from Adobe EDS
6. **Returns content** to visitor via Cloudflare

**Why the Worker is necessary:** Cloudflare Free plan doesn't allow Host header modification via Transform Rules or Origin Rules. The Worker provides this functionality.

### Worker Metrics

**Daily request limit (Free plan):** 100,000 requests/day  
**Current usage:** ~337 requests/day (well within limits)  
**CPU time per request:** ~0.8ms (very efficient)  
**Error rate:** 0% (no errors observed)

---

## Caching Configuration

### Basic Cache Settings

**Caching Level:** Standard  
**Browser Cache TTL:** Respect Existing Headers  
**Edge Cache TTL:** Respects origin headers from Adobe EDS

### Cache Rule

**Rule Name:** Adobe Edge Delivery Caching  
**When:** Hostname contains `allabout.network`  
**Then:** 
- Eligible for cache
- Browser TTL: Respect Origin TTL

**Purpose:** Tells Cloudflare to cache content from allabout.network according to Adobe EDS cache headers.

### Cache Behavior

**Static assets (images, CSS, JS):**
- Long cache TTL (hours to days)
- High cache hit ratio expected
- Cached at Cloudflare edge

**HTML pages:**
- Shorter cache TTL (minutes to hours)
- Cache varies by URL
- Purged on content updates (via push invalidation)

**Expected cache hit ratio:** 70-80% after warm-up period

### Cache Warming

Cloudflare Free plan doesn't include automatic cache warming. Cache fills naturally as visitors browse the site.

---

## Push Invalidation Configuration

Push invalidation automatically purges Cloudflare's cache when content is published in Adobe Edge Delivery Services.

**Status:** Enabled and active

### Cloudflare Credentials

**Zone ID:** [Stored in Adobe EDS config]
**API Token:** [Stored in Adobe EDS config]
**Token Permissions:** Zone → Cache Purge → Purge
**Token Scope:** Specific zone (allabout.network only)

**Security note:** API token is scoped to minimum necessary permissions (cache purge only) and specific zone only.

### API Token Audit Checklist

Use this checklist to verify API token security and compliance:

- [ ] **Minimum Permissions**: Token has only Cache Purge permission (no additional permissions)
- [ ] **Zone Scope**: Token is limited to allabout.network zone only (not all zones)
- [ ] **Token Expiration**: Token expiration set if available (consider 1-year rotation)
- [ ] **Clear Naming**: Token name clearly identifies purpose (e.g., "allabout-cache-purge")
- [ ] **Rotation Schedule**: Token rotation date recorded in change log
- [ ] **Old Token Cleanup**: Previous tokens revoked after successful rotation
- [ ] **Secure Storage**: Token stored securely in Adobe EDS config (never in public repos)
- [ ] **Access Control**: Only authorized personnel have access to token
- [ ] **Testing**: Token tested after creation/rotation using validation tool
- [ ] **Documentation**: Token creation date and purpose documented

**Recommended Actions:**
- Review this checklist quarterly or after any security incidents
- Rotate token annually as a security best practice
- Document rotation in the Change Log section

### Adobe EDS Configuration

Configuration stored in Adobe EDS project config file (`.helix/config.xlsx` or `.helix/config`):

| Key | Value | Purpose |
|-----|-------|---------|
| name | Helix website | Project name |
| host | allabout.network | Production hostname |
| cdn.prod.type | cloudflare | CDN vendor |
| cdn.prod.host | allabout.network | Production domain |
| cloudflare.apiToken | [secure token] | Cloudflare API access |
| cloudflare.zoneId | [zone ID] | Cloudflare zone identifier |
| cdn.preview.host | main--allaboutv2--ddttom.aem.page | Preview hostname |


### How Push Invalidation Works

1. **Content published** in Adobe EDS (via Sidekick)
2. **Adobe EDS triggers** push invalidation webhook
3. **Cloudflare API called** using stored credentials
4. **Cache purged** (entire site on Free plan)
5. **Next request** fetches fresh content from origin
6. **Content re-cached** for subsequent visitors

### Free Plan Behavior

**What happens on publish:**
- Entire site cache cleared (not just changed URLs)
- All cached content purged
- Next visitors trigger cache misses
- Content re-cached as visitors browse

**Performance impact:**
- Brief slowdown immediately after publish (cold cache)
- 10-30 seconds for most popular pages to re-cache
- Performance returns to normal within minutes

**Enterprise plan comparison:**
- Enterprise: Surgical purging (only changed URLs)
- Enterprise: Minimal performance impact
- Free plan: Acceptable for normal publishing workflows

### Testing Push Invalidation

Verify it's working:

```bash
# Before publishing
curl -I https://allabout.network | grep cf-cache-status
# Should show: HIT

# Publish content in Adobe EDS via Sidekick
# Wait 5-10 seconds

# After publishing
curl -I https://allabout.network | grep cf-cache-status
# Should show: MISS (cache was purged)

# Request again
curl -I https://allabout.network | grep cf-cache-status
# Should show: HIT (newly cached)
```

Or use Adobe's validation tool: https://www.aem.live/tools/cdn-validator

---

## Adobe Edge Delivery Services Integration

### Origin Configuration

**Origin Hostname:** main--allaboutv2--ddttom.aem.live  
**Origin Type:** Adobe Edge Delivery Services  
**Backend CDN:** Fastly (Adobe-managed)  
**Content Source:** Adobe Experience Manager / Document-based authoring

### Origin Details

**Format breakdown:**
- `main` = Git branch
- `allaboutv2` = Repository name
- `ddttom` = GitHub owner/organisation
- `.aem.live` = Adobe EDS production domain

**Preview URL:** main--allaboutv2--ddttom.aem.page (different domain for preview)

### How Origin Resolution Works

When visitor requests `https://allabout.network`:

1. **DNS resolves** to Cloudflare IP (104.21.41.41 or 172.67.159.249)
2. **Request hits** Cloudflare edge server
3. **Worker intercepts** and rewrites Host header to `main--allaboutv2--ddttom.aem.live`
4. **Cloudflare fetches** from that hostname
5. **DNS resolves** `main--allaboutv2--ddttom.aem.live` to Fastly IP (199.232.89.91 via n.sni.global.fastly.net)
6. **Adobe's Fastly** serves content from Adobe EDS
7. **Response flows back** through Cloudflare to visitor
8. **Cloudflare caches** the response

### Expected HTTP Headers

Responses include headers from both Cloudflare and Adobe's Fastly:

```
server: cloudflare
cf-ray: [Cloudflare edge identifier]
cf-cache-status: [HIT/MISS/DYNAMIC]
x-served-by: cache-lga21965 [Fastly cache identifier]
```

**This is normal and expected.** Both sets of headers appearing confirms the double-CDN architecture is working correctly.

---

## Performance Characteristics

### Expected Performance

**Cache Hit Ratio:**
- Target: 70-80% for static content
- After warm-up: 70-80%+

**Response Times:**
- Cached content: 50-150ms (very fast, served from Cloudflare edge)
- Cache miss: 300-800ms (fetches from Adobe EDS via Fastly)
- First visit after publish: 300-800ms (cache cleared, fresh fetch)

**Time to First Byte (TTFB):**
- Cache hit: <100ms
- Cache miss: 200-500ms

### Geographic Distribution

**Cloudflare edge locations:** 300+ data centres worldwide  
**Coverage:** Excellent global coverage  
**User location:** Content served from nearest Cloudflare edge

**Note:** Tom is UK-based, so most testing shows London/European edge servers, but global visitors use their local edges.

---

## Security Configuration

### DDoS Protection

**Status:** Active (Cloudflare Free plan)  
**Type:** Automatic, always-on  
**Coverage:** L3/L4 and L7 DDoS attacks  
**No configuration needed:** Works automatically

### Security Level

**Setting:** Medium (default)  
**Challenge threshold:** Standard  
**Bot protection:** Basic (free tier)

### WAF (Web Application Firewall)

**Status:** Not available on Free plan  
**Upgrade required:** Pro plan ($20/month) or higher for WAF rules

### Rate Limiting

**Status:** Not configured (not available on Free plan)  
**Available on:** Pro plan ($20/month) or higher

### SSL/TLS Encryption

**Mode:** Full  
**Minimum TLS:** 1.2  
**Certificate:** Cloudflare Universal SSL (auto-renewed)  
**HTTPS Enforced:** Yes (Always Use HTTPS enabled)

### Bot Protection

**Bot Fight Mode:** Not enabled (available on Free plan if needed)  
**Challenge:** CAPTCHAs for suspicious traffic (medium security level)

---

## Monitoring and Analytics

### Cloudflare Analytics

**Available metrics:**
- Requests per day/hour
- Bandwidth usage
- Threats blocked
- Cache hit ratio
- Status codes
- Geographic distribution
- Top paths

**Access:** Dashboard → Analytics & Logs → Traffic

### Worker Metrics

**Available metrics:**
- Request count
- Error rate
- CPU time
- Success rate

**Access:** Workers & Pages → aem-worker → Metrics

**Current status:**
- Requests: 337/100,000 daily limit (0.3% used)
- CPU time: 0.8ms average (very efficient)
- Errors: 0%
- Success rate: 100%

### Recommended Monitoring

**Daily checks (first week):**
- Cache hit ratio trending upward
- Error rates remaining at 0%
- Worker request count well under limits
- No certificate errors

**Weekly checks (ongoing):**
- Analytics for traffic patterns
- Cache performance
- Any security threats blocked

### Automation Opportunities

**Health Check Script** (potential implementation):

```bash
#!/bin/bash
# cloudflare-health-check.sh
# Quick validation of Cloudflare + Adobe EDS integration

echo "=== Cloudflare + Adobe EDS Health Check ==="
echo ""

echo "1. Checking DNS resolution..."
DNS_RESULT=$(dig allabout.network +short | head -1)
if [[ $DNS_RESULT =~ ^104\.|^172\. ]]; then
  echo "   ✓ DNS resolves to Cloudflare: $DNS_RESULT"
else
  echo "   ✗ DNS issue: $DNS_RESULT"
fi
echo ""

echo "2. Checking HTTPS and SSL..."
SSL_STATUS=$(curl -sI https://allabout.network | grep -i "server:")
CACHE_STATUS=$(curl -sI https://allabout.network | grep -i "cf-cache-status:")
echo "   Server: $SSL_STATUS"
echo "   Cache: $CACHE_STATUS"
echo ""

echo "3. Checking origin resolution..."
ORIGIN=$(dig main--allaboutv2--ddttom.aem.live +short | head -1)
echo "   Origin resolves to: $ORIGIN"
echo ""

echo "4. Checking HTTP status..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://allabout.network)
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✓ Site returns HTTP $HTTP_CODE"
else
  echo "   ✗ Site returns HTTP $HTTP_CODE"
fi
echo ""

echo "=== Health Check Complete ==="
```

**Usage:**
```bash
chmod +x cloudflare-health-check.sh
./cloudflare-health-check.sh
```

**Note**: This script is not currently implemented, but provides a starting point for automated health monitoring. Consider adding Cloudflare API calls for worker metrics if needed.

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Site Not Loading

**Check:**
1. DNS propagation complete: `dig allabout.network +short`
2. Should return Cloudflare IPs (104.x.x.x or 172.x.x.x)
3. Worker active and deployed
4. Routes configured correctly

**Solution:** Check Cloudflare dashboard for service status

#### Certificate Errors

**Symptoms:** Browser shows SSL warning

**Common causes:**
- SSL/TLS mode set to Full (strict) instead of Full
- Certificate still provisioning (takes 5-10 minutes)

**Solution:** Verify SSL/TLS mode is "Full" not "Full strict"

#### 421 Mismatch Error

**Symptoms:** HTTP 421 error

**Common causes:**
- Worker not active
- ORIGIN_HOSTNAME incorrect
- Routes not configured

**Solution:** 
1. Verify worker routes are active
2. Check ORIGIN_HOSTNAME = main--allaboutv2--ddttom.aem.live
3. Review worker logs for errors

#### Cache Not Clearing After Publish

**Symptoms:** Old content still showing after publishing

**Common causes:**
- Push invalidation not configured correctly
- API token invalid or expired
- Worker missing PUSH_INVALIDATION=enabled

**Solution:**
1. Test with validation tool: https://www.aem.live/tools/cdn-validator
2. Verify API token still valid
3. Check worker has PUSH_INVALIDATION=enabled
4. Manual cache purge: Caching → Purge Everything (temporary workaround)

#### Slow Performance

**Expected during:**
- Immediately after publishing (cache purged)

**Investigate if:**
- Cache hit ratio below 60%
- TTFB consistently over 1 second

**Check:**
1. Cache hit ratio in analytics
2. Worker CPU time (should be <5ms)
3. Adobe EDS origin health
4. Cache rules configured correctly

---

## Operational Procedures

### Publishing Content

**Normal workflow:**
1. Edit content in Adobe EDS (SharePoint/Google Docs)
2. Use Sidekick extension to preview changes
3. Click "Publish" in Sidekick
4. Wait 5-10 seconds for push invalidation
5. Content appears live immediately

**What happens:**
- Adobe EDS notifies Cloudflare
- Cloudflare purges cache (entire site on Free plan)
- Next visitor gets fresh content
- Content re-caches automatically

### Manual Cache Purging

**When needed:**
- Push invalidation fails
- Need to force cache clear
- Testing cache behavior

**How to purge:**
1. Cloudflare dashboard
2. Caching → Configuration
3. Purge Cache → Purge Everything
4. Confirm

**Warning:** Cache purge causes performance dip for 10-30 minutes whilst cache rebuilds.

### Updating Worker Code

**When needed:**
- Adobe releases worker updates
- Bug fixes
- New features

**How to update:**
1. Get latest code: https://raw.githubusercontent.com/adobe/aem-cloudflare-prod-worker/main/src/index.mjs
2. Workers & Pages → aem-worker → Quick Edit
3. Select all code, delete
4. Paste new code
5. Deploy
6. Test site still works

### Rotating API Token

**When needed:**
- Token compromised
- Security policy requires rotation
- Token expiring

**How to rotate:**
1. Create new API token in Cloudflare
2. Update Adobe EDS config with new token
3. Publish config via Sidekick
4. Test push invalidation works
5. Revoke old token

### DNS Changes

**Adding subdomains:**
1. Add CNAME record in Cloudflare DNS
2. Point to main--allaboutv2--ddttom.aem.live
3. Enable Proxy (orange cloud)
4. Add worker route for new subdomain
5. Test subdomain loads correctly

**Important:** Never use wildcard DNS records or routes for security and SEO reasons.

---

## Upgrade Considerations

### Cloudflare Free Plan Limitations

**Current limitations:**
- 3 Page Rules (enough for basic needs)
- No WAF rules (no custom security rules)
- No rate limiting
- Entire site cache purge (not surgical)
- Basic analytics only
- Email support (slower response)

**What works well on Free:**
- CDN functionality (unlimited bandwidth)
- SSL certificates
- DDoS protection
- Workers (10,000 requests/day)
- Basic cache control
- Push invalidation (entire site purge)

### Pro Plan Benefits ($20/month)

**Worth considering if:**
- Need WAF rules (custom security)
- Want surgical cache purging (faster updates)
- Need advanced analytics
- Require priority support
- Want mobile optimisation

**Probably not needed for allabout.network** unless security requirements change or publishing frequency increases significantly.

### Enterprise Plan Benefits (Custom pricing)

**Only needed if:**
- Very high traffic (millions of requests/day)
- Need 99.95% SLA
- Advanced security requirements
- Multiple team members managing
- Need dedicated support

**Not recommended for allabout.network** - significant overkill for personal/professional site.

---

## Best Practices

### Content Publishing

**Do:**
- Test changes in preview before publishing
- Use Sidekick for all publishing operations
- Wait 10-15 seconds after publishing before checking live site
- Clear browser cache when testing (Cmd+Shift+R)

**Don't:**
- Manually purge Cloudflare cache unless necessary
- Publish multiple times rapidly (gives cache no time to warm)
- Forget that Free plan purges entire site (brief performance impact)

### Worker Management

**Do:**
- Keep worker code updated from Adobe's official repository
- Monitor worker metrics regularly
- Keep environment variables secure
- Document any custom modifications

**Don't:**
- Modify worker code unless necessary (Adobe's code is well-tested)
- Share API tokens or Zone IDs publicly
- Delete worker routes accidentally (site will break)
- Exceed 100,000 requests/day (upgrade if approaching limit)

### Security

**Do:**
- Keep API tokens with minimum necessary permissions
- Rotate tokens periodically (annually minimum)
- Monitor security analytics for threats
- Keep SSL/TLS mode at Full (not Flexible)

**Don't:**
- Use Full (strict) SSL mode (causes 526 errors with Adobe EDS)
- Disable Always Use HTTPS
- Ignore security warnings in analytics
- Share account credentials

### Monitoring

**Do:**
- Check analytics weekly
- Monitor cache hit ratio (aim for 70%+)
- Review worker error rates
- Watch for unusual traffic patterns

**Don't:**
- Ignore sustained high error rates
- Assume everything's fine without checking
- Wait for users to report issues
- Forget to monitor after making changes

---

## Support and Resources

### Primary Contacts

**Domain Owner:** Tom Cranstoun  
**Email:** tom.cranstoun@gmail.com  
**Company:** Digital Domain Technologies Ltd

### Official Documentation

**Adobe Edge Delivery Services:**
- Documentation: https://www.aem.live/docs/
- Cloudflare setup: https://www.aem.live/docs/byo-cdn-cloudflare-worker-setup
- Push invalidation: https://www.aem.live/docs/setup-byo-cdn-push-invalidation
- CDN validator: https://www.aem.live/tools/cdn-validator
- Discord: https://discord.gg/aem-live

**Cloudflare:**
- Dashboard: https://dash.cloudflare.com
- Workers docs: https://developers.cloudflare.com/workers/
- DNS docs: https://developers.cloudflare.com/dns/
- Community: https://community.cloudflare.com/

### Related Project Documentation

**allabout.network Documentation:**
- **EDS Architecture**: `docs/for-ai/implementation/eds-architecture-standards.md` - Core EDS architecture patterns and standards
- **Build Process**: `docs/for-ai/implementation/build-blocks-clarification.md` - Dual-directory pattern for complex components
- **Security Guidelines**: `docs/for-ai/guidelines/security-checklist.md` - Security validation checklist
- **Block Architecture**: `docs/for-ai/implementation/block-architecture-standards.md` - Block development standards
- **Design System**: `docs/for-ai/guidelines/design-system.md` - Design tokens and component patterns
- **Project Guide**: `CLAUDE.md` - Complete project overview for AI assistants
- **Documentation Index**: `docs/for-ai/index.md` - Navigation hub for all documentation

### Quick Reference Commands

**Check DNS:**
```bash
dig allabout.network +short
dig www.allabout.network +short
dig allabout.network NS +short
```

**Check HTTP headers:**
```bash
curl -I https://allabout.network
curl -I https://www.allabout.network
```

**Check cache status:**
```bash
curl -I https://allabout.network | grep cf-cache-status
```

**Check SSL:**
```bash
curl -I https://allabout.network | grep -E "(server|ssl|tls)"
```

**Check origin resolution:**
```bash
dig main--allaboutv2--ddttom.aem.live +short
```

### Emergency Contacts

**Cloudflare Issues:**
- Community forum: https://community.cloudflare.com/
- Status page: https://www.cloudflarestatus.com/
- Support: Available via dashboard (response time: hours on Free plan)

**Adobe EDS Issues:**
- Discord: https://discord.gg/aem-live
- Status: https://status.adobe.com/products/503489
- Documentation: https://www.aem.live/docs/

**Domain Registrar (GoDaddy):**
- Only needed for nameserver changes
- Account: tom.cranstoun@gmail.com
- Support: https://uk.godaddy.com/contact-us

---

## Future Considerations

### Potential Enhancements

**Email Service:**
- Currently no email configured
- If needed: Add MX, SPF, DKIM records
- Consider: Google Workspace, Microsoft 365, or Cloudflare Email Routing

**Additional Subdomains:**
- blog.allabout.network (if blog section added)
- Could point to same Adobe EDS or different service
- Would need DNS CNAME and worker route

**Performance Optimisation:**
- Auto Minify (available on Free plan)
- Image optimisation (requires Pro plan)
- Additional cache rules (if needed)

**Security Enhancement:**
- WAF rules (requires Pro plan)
- Rate limiting (requires Pro plan)
- Bot management (advanced features on paid plans)

### Monitoring Improvements

**Recommended additions:**
- Third-party uptime monitoring (e.g., UptimeRobot)
- Performance monitoring (e.g., WebPageTest scheduled tests)
- Synthetic monitoring for key user journeys

### Cost Analysis

**Current cost:** £0/month (Cloudflare Free)

**Upgrade cost if needed:**
- Pro: $20/month (£16/month)
- Business: $200/month (£160/month)
- Enterprise: Custom pricing (thousands/month)

**Recommendation:** Stay on Free plan unless specific paid features become necessary.

---

## Appendix: Configuration Checklist

Use this checklist to verify configuration if troubleshooting or rebuilding setup:

### DNS Configuration
- [ ] Nameservers point to Cloudflare (angela.ns.cloudflare.com, george.ns.cloudflare.com)
- [ ] CNAME @ → main--allaboutv2--ddttom.aem.live (Proxied)
- [ ] CNAME www → main--allaboutv2--ddttom.aem.live (Proxied)
- [ ] No conflicting A records
- [ ] DNS propagation complete (dig returns Cloudflare IPs)

### SSL/TLS Configuration
- [ ] Encryption mode: Full (not Flexible or Full strict)
- [ ] Always Use HTTPS: Enabled
- [ ] Minimum TLS version: 1.2 or higher
- [ ] Universal SSL certificate: Active
- [ ] No certificate errors when browsing

### Cache Configuration
- [ ] Caching Level: Standard
- [ ] Browser Cache TTL: Respect Existing Headers
- [ ] Cache rule created for hostname
- [ ] Cache rule: Browser TTL set to Respect Origin TTL
- [ ] Cache hit ratio improving over time

### Worker Configuration
- [ ] Worker name: aem-worker
- [ ] Code: Latest from Adobe GitHub
- [ ] Environment variable: ORIGIN_HOSTNAME = main--allaboutv2--ddttom.aem.live
- [ ] Environment variable: PUSH_INVALIDATION = enabled
- [ ] Route: allabout.network/*
- [ ] Route: www.allabout.network/*
- [ ] Worker metrics showing requests
- [ ] No errors in worker logs

### Push Invalidation
- [ ] Adobe EDS config: cdn.prod.type = cloudflare
- [ ] Adobe EDS config: cdn.prod.host = allabout.network
- [ ] Adobe EDS config: cloudflare.apiToken = [token]
- [ ] Adobe EDS config: cloudflare.zoneId = [zone ID]
- [ ] Config published via Sidekick
- [ ] Test publish clears cache
- [ ] Validation tool shows success

### Verification
- [ ] Site loads at https://allabout.network
- [ ] Site loads at https://www.allabout.network
- [ ] HTTP redirects to HTTPS
- [ ] No SSL warnings
- [ ] Headers show "server: cloudflare"
- [ ] Cache status header present (cf-cache-status)
- [ ] Content displays correctly
- [ ] All pages accessible
- [ ] Publishing workflow works

---

## Document Maintenance

**Owner:** Tom Cranstoun  
**Created:** 9 December 2025  
**Last Updated:** 9 December 2025  
**Review Schedule:** Quarterly or after significant changes  
**Version:** 1.0

**Update this document when:**
- Configuration changes made
- Workers updated
- DNS records modified
- Push invalidation settings changed
- Cloudflare plan upgraded
- Issues discovered and resolved
- Best practices identified

---

## Change Log

### 2025-12-09 - Initial Documentation
- Documented complete Cloudflare configuration
- Added worker setup details (aem-worker with ORIGIN_HOSTNAME and PUSH_INVALIDATION)
- Included push invalidation configuration with API token setup
- Documented DNS configuration (CNAME records for apex and www)
- Added SSL/TLS configuration (Full mode)
- Included cache configuration and rules
- Added troubleshooting guide and operational procedures
- Documented architecture with ASCII diagram
- Added monitoring guidance and metrics
- Included configuration checklist for validation
- Added upgrade considerations and cost analysis

---

## End of Document

This reference document provides complete details of the current allabout.network Cloudflare configuration for use by AI assistants helping Tom Cranstoun manage the site. All configuration details are current as of 9 December 2025.