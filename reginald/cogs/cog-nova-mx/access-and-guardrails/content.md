---
name: access-and-guardrails
version: "1.0"
description: How cogs are protected. Access control for content and execution — encryption, authentication, and the guardrail pattern where one cog unlocks another.

created: 2026-02-09
modified: 2026-02-09

author: Tom Cranstoun and Maxine
maintainer: mx.machine.experience@gmail.com
license: proprietary
status: published

category: mx-core
partOf: mx-os
refersTo: [cog-unified-spec]
builds-on: [what-is-a-cog, what-is-mx-os, how-mx-os-runs]
tags: [access-control, security, encryption, oauth, guardrail, permissions, trust, authentication]

audience: developers
reading-level: technical
purpose: Document the access control layer of MX OS — how cogs are protected, how agents gain access, and the guardrail pattern

mx:
  contentType: "action-doc"
  runbook: "mx exec access-and-guardrails"

execute:
  runtime: runbook
  command: mx cog access
  actions:
    - name: explain
      description: Present the access control model to any audience
      usage: Read this cog and explain the five access types, the guardrail pattern, and the relationship between trust and access
      outputs:
        - name: explanation
          type: string
          description: Clear explanation of cog access control

    - name: check
      description: Check the access requirements of a specific cog
      usage: Read the target cog's frontmatter, look for the access object, and report what is required to read or execute it
      inputs:
        - name: cog-name
          type: string
          required: true
          description: Name of the cog to check
      outputs:
        - name: access-report
          type: object
          description: Access type, gate requirements, and how to proceed

    - name: gate
      description: Execute a guardrail check for a protected cog
      usage: Read the guardrail action-doc named in the access.gate field, execute its check action, and report whether access is granted
      inputs:
        - name: target-cog
          type: string
          required: true
          description: The cog the agent wants to access
      invokes: []
      outputs:
        - name: access-result
          type: object
          description: Whether access was granted or denied, with reasoning
---

# Access and Guardrails

Not every cog is open. Some contain sensitive information. Some have actions that should not run without authorisation. Some are encrypted. Some live behind a login.

This cog documents the access control layer of MX OS — a layer that is separate from trust, works alongside it, and ensures that cogs can exist at every visibility level without compromising what needs to stay protected.

---

## Why Access Control Exists

MX OS runs everywhere — USB sticks, filesystems, web servers, registries. Ubiquity is the strength. But ubiquity means cogs end up in places where not everyone should see everything.

A company's pricing cog should be discoverable (agents should know it exists) but not readable without credentials. A client's strategy document should be a cog (structured, machine-readable) but encrypted at rest. A deployment action-doc should not execute unless the agent has been authorised.

The access layer makes this possible without breaking the format.

---

## Trust and Access Are Separate

| Layer | Question | Mechanism |
| --- | --- | --- |
| **Trust (COG)** | Is this cog genuine? | Certificate of Genuineness, compliance levels, signatures |
| **Access** | Can I read or run this cog? | Guardrail cogs, encryption, authentication |

A cog can be:

- **Genuine and public** — verified by COG, readable by anyone
- **Genuine and locked** — verified by COG, but content requires authorisation
- **Unverified and public** — no COG, anyone can read it
- **Unverified and locked** — no COG, content is gated

Both layers add value independently. Neither depends on the other.

---

## The Five Access Types

### 1. Public

```yaml
access:
  type: public
```

No gate. Any agent that can read the file can read the content and execute the actions. This is the default — if `access` is not present in the frontmatter, the cog is public.

Most cogs are public. The format is designed for open sharing.

**OS analogy:** `chmod 644` — world-readable.

### 2. Guardrail

```yaml
access:
  type: guardrail
  gate: team-auth
  note: "Requires team-auth cog to verify credentials"
```

A guardrail action-doc must execute and grant access before the agent can read the content or execute actions. The `gate` field names the guardrail cog.

The guardrail pattern:

1. Agent wants to read `client-pricing.cog.md`
2. Agent reads the frontmatter — sees `access.type: guardrail`, `access.gate: team-auth`
3. Agent reads `team-auth.cog.md` (the guardrail)
4. Agent executes the guardrail's check action (verify credentials, check token, validate identity)
5. If granted: agent reads the locked content
6. If denied: agent sees only the frontmatter (for discovery) but not the content

The guardrail action-doc is itself a cog — it has frontmatter, it follows the spec, it can be in the registry. The difference is that its actions control access to other cogs.

**OS analogy:** `sudo` / PolicyKit — a privilege escalation that checks before granting.

### 3. Encrypted

```yaml
access:
  type: encrypted
  note: "AES-256 encrypted. Key held by project lead"
```

The cog file or its content section is encrypted. The YAML frontmatter remains in plain text (so the cog can be discovered and catalogued) but the markdown content below the frontmatter is encrypted.

An agent encountering an encrypted cog:

1. Reads the frontmatter — knows what the cog is, sees `access.type: encrypted`
2. Cannot read the content without the decryption key
3. May request the key from a guardrail cog, a key management system, or the user

**OS analogy:** dm-crypt / FileVault / LUKS — filesystem-level encryption.

### 4. Password

```yaml
access:
  type: password
  note: "HTTP basic auth required. Contact ops team for credentials"
```

The cog is behind credential-based access — HTTP basic auth, a login page, or any mechanism that requires a username and password. This typically applies to hosted cogs (on web servers or behind APIs).

An agent encountering a password-protected cog:

1. Reads the URL or path — attempts to fetch the cog
2. Receives an authentication challenge
3. Needs credentials to proceed (from user, environment variable, secrets manager, or guardrail cog)

**OS analogy:** Login prompt / PAM authentication.

### 5. OAuth

```yaml
access:
  type: oauth
  provider: azure-ad
  note: "Azure AD SSO required. Enterprise accounts only"
```

The cog is behind an OAuth flow — enterprise SSO, cloud provider authentication, or third-party identity provider. The `provider` field names the OAuth provider.

An agent encountering an OAuth-protected cog:

1. Reads the frontmatter — sees `access.type: oauth`, `access.provider: azure-ad`
2. Must complete an OAuth flow to obtain a token
3. Presents the token to access the content

This is common for cogs hosted in enterprise environments — Google Workspace, Microsoft 365, corporate intranets.

**OS analogy:** Kerberos / SSO / SAML.

---

## Frontmatter Stays Discoverable

This is a critical design principle: **even when a cog's content is locked, its frontmatter remains readable.**

```yaml
---
name: quarterly-revenue-forecast
version: "3.1"
description: Revenue projections for Q2 2026 by region and product line
category: finance
tags: [revenue, forecast, quarterly, confidential]
audience: finance-team
access:
  type: guardrail
  gate: finance-auth
  note: "Finance team credentials required"
---
# [Content locked — guardrail required]
```

An AI agent reading this cog knows:

- What it is (quarterly revenue forecast)
- What it covers (Q2 2026, by region and product line)
- Who it is for (finance team)
- That it exists and where it fits in the ecosystem

But the agent cannot read the actual revenue numbers without passing through the guardrail.

This means registries can catalogue locked cogs. Search results can include them. The builds-on graph can reference them. The agent knows the cog exists and what context it provides — it just cannot access the content until authorised.

**Discovery is public. Content is gated.** This is how any large-scale system works — you can see what books are in the library catalogue without being able to read every book.

---

## The Guardrail Action-Cog

A guardrail is an action-doc with actions that check access. It is the bouncer of MX OS.

### Example Guardrail

```yaml
---
name: team-auth
version: "1.0"
description: Verifies team membership before granting access to protected cogs
category: mx-core
tags: [authentication, access-control, guardrail]

execute:
  runtime: runbook
  actions:
    - name: check
      description: Verify that the requesting agent or user has team credentials
      usage: Check for a valid team token, environment variable, or user confirmation
      inputs:
        - name: user
          type: string
          required: false
          description: User or agent identity to verify
      outputs:
        - name: granted
          type: boolean
          description: Whether access is granted
        - name: reason
          type: string
          description: Why access was granted or denied
---

# Team Authentication Guardrail

This action-doc checks team membership. Protected cogs that declare
`access.gate: team-auth` require this guardrail to execute before
their content becomes accessible.
```

### What a Guardrail Can Check

- **Environment variables** — is `TEAM_TOKEN` set?
- **User confirmation** — ask the user "do you have authorisation?"
- **OAuth tokens** — is there a valid bearer token?
- **File presence** — does a `.credentials` file exist?
- **Another cog** — invoke a higher-level guardrail (cascading gates)
- **Time-based** — is this within business hours?
- **Role-based** — does the user's identity match an allowed role?

The guardrail pattern is deliberately flexible. The `runtime: runbook` guardrail uses the AI agent's capabilities to check access. A `runtime: bash` guardrail could run a script that validates tokens programmatically.

---

## Cascading Gates

A guardrail can itself be gated. This creates a cascading access chain:

```
Agent wants: top-secret-pricing.cog.md
  → gate: senior-auth
    → gate: team-auth
      → public (no gate)
```

The agent must pass through `team-auth` first, then `senior-auth`, then can access the pricing cog. Each guardrail is independent — it checks its own requirements.

This mirrors how real access control works. You log into the network (team-auth), then elevate to admin (senior-auth), then access the restricted system (the locked cog).

---

## Access and the OS Analogy

| OS Concept | MX OS Equivalent |
| --- | --- |
| File permissions (`rwx`) | `access.type` — who can read, who can execute |
| `sudo` / privilege escalation | Guardrail action-doc — must pass check before access |
| Encrypted filesystem | `access.type: encrypted` — content encrypted, frontmatter readable |
| Login / PAM | `access.type: password` — credential-based gate |
| SSO / Kerberos | `access.type: oauth` — identity provider gate |
| ACL (Access Control List) | Guardrail actions that check roles, tokens, or identity |
| Capability-based security | The agent's tools and credentials determine what gates it can pass |

---

## For AI Agents

If you encounter a cog with an `access` object:

1. **Read the frontmatter** — you can always do this. Note the access type and gate
2. **If public or no access field** — read and execute freely
3. **If guardrail** — read the named guardrail cog, execute its check action
4. **If encrypted** — report that decryption is needed, request key from user
5. **If password or oauth** — report the authentication requirement, assist user with the flow
6. **Never bypass** — if you cannot pass a gate, say so. Do not guess at locked content
7. **Report what you know** — even if locked, the frontmatter tells you what the cog is. Use that metadata

**Output Reporting Principle:** When an action-doc completes its work and creates any outputs (files, directories, etc.), it MUST report the full absolute path of every output created. This enables traceability and makes it easy to locate generated files.

Example:

```
✓ PDF generated successfully

Output:
  /Users/tom/Documents/MX/mx-outputs/pdf/books/handbook/mx-handbook.pdf (2.2MB)
```

Not just "PDF generated" or "mx-outputs/pdf/books/handbook/mx-handbook.pdf" — the full absolute path from root.

---

*Discovery is public. Content is gated. Trust is separate. The OS protects what matters.*
