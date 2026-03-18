---
version: "1.0"
description: "Contribution guidelines for the block architecture. Open standard, backward compatible, no proprietary lock-in."
created: 2026-02-12
modified: 2026-02-12
author: Tom Cranstoun

mx:
  license: proprietary
  status: active
  category: governance
  partOf: mx-maxine-lives
  tags: [contributing, governance, the-gathering, open-standard]

  inherits: CONTRIBUTING.md

  blocks:
    - prose:
        source: CONTRIBUTING.md
        description: "Human-readable contribution guidelines for the block architecture."
    - definition:
        standards:
          - name: "The Gathering"
            version: "2.0-draft"
            scope: "Contribution process for cog specification work"
        validation:
          - "All contributions must maintain backward compatibility"
          - "No proprietary extensions that can't be openly implemented"
          - "No changes that require personal data to leave the client device"
    - policy:
        contribution-model: "open"
        governance: "The Gathering (W3C model)"
        license-requirement: "MIT"
        backward-compatibility: "mandatory"
        privacy-requirement: "personal data never leaves client"
    - essence:
        type: contribution-policy
        accepts:
          - specification-improvements
          - implementation-reports
          - test-cases
          - documentation-corrections
          - examples
        rejects:
          - backward-incompatible-changes-without-consensus
          - proprietary-extensions
          - privacy-violating-features

  contentType: "contribution-policy"
  runbook: "This defines how people contribute to the block architecture specification. The Gathering governs contributions to the open standard. CogNovaMX governs its own products separately. Contributions must maintain backward compatibility and must never require personal data to leave the client."
---

# Contributing

This cog inherits its prose from [CONTRIBUTING.md](CONTRIBUTING.md).

Machine-readable contribution policy for the block architecture specification. The policy block declares the rules. The definition block declares the standards. Agents reading this cog know what's accepted and what's not without parsing the prose.
