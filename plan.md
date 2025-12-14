# Product Requirements Document (PRD): Bright Sparks Management System
**Version:** 2.0  
**Last Updated:** December 2024  
**Owner:** Frankie, Bright Sparks of York Ltd  
**Developer:** Tom, Digital Domain Technologies Ltd

---

## 1. Executive Summary

Bright Sparks of York requires an integrated business management system to support its growth from a solo operation to a team-based electrical contracting business. The system will centralize job scheduling, financial tracking (Xero), customer relationship management (CRM), supplier cost tracking, and marketing communications.

**Critical Architectural Requirement: The system must be white-labelable AND multi-trade from Day 1.** This is not a future feature - it's a core design principle. The entire platform will be built as a multi-tenant system that works for **any trade-based service business**: electricians, plumbers, plasterers, heating engineers, builders, gas engineers, roofers, decorators, landscapers, etc.

**Multi-Trade Flexibility:**
- Trade-agnostic core (scheduling, invoicing, customer management)
- Customizable job types per trade (e.g., "Rewire" for electricians, "Boiler Service" for plumbers)
- Customizable supplier lists (electrical wholesalers vs plumbing merchants)
- Trade-specific compliance tracking (NICEIC for electricians, Gas Safe for engineers)
- Industry-specific pricing models (hourly rates, day rates, fixed price quotes)

**Success Criteria:**
- Eliminate unbilled materials through automated supplier invoice tracking
- Reduce administrative time by 50% through integration automation
- Enable seamless team expansion with operator-level analytics
- Maintain real-time financial visibility (costs vs revenue per job)
- **Zero hardcoded business logic** - all pricing, branding, and workflows configurable per tenant
- **Zero trade-specific assumptions** - system adapts to any service-based trade
- **SaaS-ready architecture** - Tom can onboard contractors from any trade within 60 minutes

**Market Opportunity:**
- **UK Market Size**: 
  - Electricians: ~250,000 businesses
  - Plumbers: ~150,000 businesses  
  - Plasterers: ~50,000 businesses
  - Heating engineers: ~80,000 businesses
  - General builders: ~200,000 businesses
  - **Total addressable market: 730,000+ trade businesses in UK alone**

**Strategic Value:**
- **For Bright Sparks**: Custom solution for £0 development cost (Tom builds, Bright Sparks provides requirements/testing)
- **For Tom**: Reusable SaaS product with massive market (10,000 customers = £2.4M/year potential)
- **Win-Win**: Bright Sparks gets lifetime free access, Tom gets proven product with first customer
- **Market Validation**: If it works for electricians, it works for all trades (proven by Bright Sparks)

---

## 2. Platform Architecture

### 2.1 White-Label Requirement

**CRITICAL: The entire system must be multi-tenant and white-labelable from launch.**

This is not a future enhancement - it's a core architectural requirement. The system will be built to support multiple businesses, each with their own:
- Branding (logo, colours, company name)
- Domain name (e.g., brightsparks-york.com, another-electrician.co.uk)
- Business rules (hourly rates, markup percentages, payment terms)
- Integration credentials (separate Xero/Monday.com/etc accounts)
- Customer data (completely isolated between tenants)

**Use Cases:**
1. **Primary**: Bright Sparks of York uses the system
2. **Secondary**: Tom can offer the same system to other electrical contractors
3. **Revenue Opportunity**: SaaS model - other businesses pay monthly subscription

**Technical Implications:**
- Tenant identification via subdomain or custom domain
- Tenant-specific configuration stored in database
- All queries filtered by tenant_id
- Branding loaded dynamically from tenant config
- No hardcoded business logic (rates, terms must be configurable)

### 2.2 Core Technology Stack
- **Frontend**: Custom React Application via Vite (Scheduler + Dashboard + Video Interface)
- **Backend**: Cloudflare Workers + R2/S3 Object Storage + **Multi-tenant Database**
- **Mobile**: Responsive web application (no native apps required)
- **Tenant Isolation**: Row-level security, separate API credentials per tenant

### 2.3 Tenant Configuration Model

Each tenant (business) has their own configuration record:

```javascript
{
  tenant_id: "brightsparks-york",
  domain: "brightsparks-york.com",
  
  // Branding
  branding: {
    company_name: "Bright Sparks of York Ltd",
    logo_url: "https://cdn.../brightsparks-logo.png",
    primary_color: "#FFD700",      // Gold/Yellow
    secondary_color: "#1F2937",    // Dark grey
    accent_color: "#F59E0B",       // Amber
    favicon_url: "https://cdn.../favicon.ico"
  },
  
  // Business Details
  business: {
    trade: "electrical",           // electrical, plumbing, plastering, heating, building, roofing, decorating, gas, landscaping
    company_name: "Bright Sparks of York Ltd",
    industry_certifications: [     // Trade-specific
      "NICEIC Approved Contractor",
      "Part P Registered"
    ],
  },
  
  // Pricing (fully customizable per trade)
  pricing: {
    hourly_rate: 60.00,            // £60/hour
    materials_markup: 0.20,        // 20%
    minimum_charge_hours: 1.0,     // Minimum 1 hour
    vat_rate: 0.20,                // 20% UK VAT
    time_rounding: "half_hour",    // Round to nearest 0.5hr
    pricing_model: "hourly",       // hourly, day_rate, fixed_price, or mixed
    day_rate: null,                // For plasterers/decorators (e.g., £250/day)
  },
  
  payment_terms: {
    standard_days: 7,              // 7 days payment terms
    overdue_reminder_days: 14,     // Send reminder at 14 days
    late_payment_fee: 0.00         // No late fees (yet)
  },
  
  // Contact Details
  contact: {
    email_primary: "frankie@brightsparks-york.com",
    email_hello: "hello@brightsparks-york.com",
    phone: "01904 XXXXXX",
    address: "York, UK",
    vat_number: "GB XXXXXXXXX"
  },
  
  // Enabled Connectors (tenant chooses which to use)
  connectors: {
    accounting: {
      type: "xero",              // or "quickbooks", "sage"
      enabled: true,
      config: {
        client_id: "encrypted_value",
        client_secret: "encrypted_value",
        tenant_id: "xero_tenant_id",
        refresh_token: "encrypted_value"
      }
    },
    crm: {
      type: "monday",            // or "hubspot", "built-in", "none"
      enabled: true,
      config: {
        api_key: "encrypted_value",
        board_id: "12345678"
      }
    },
    messaging: {
      type: "timelines-ai",      // or "twilio", "built-in", "none"
      enabled: true,
      config: {
        api_key: "encrypted_value",
        whatsapp_number: "+44XXXXXXXXXX"
      }
    },
    calendar: {
      type: "google",            // or "outlook", "apple"
      enabled: true,
      config: {
        oauth_token: "encrypted_value",
        calendar_id: "primary"
      }
    },
    automation: {
      type: "make",              // or "zapier", "n8n", "none"
      enabled: true,
      config: {
        webhook_url: "https://hook.eu1.make.com/...",
        api_key: "encrypted_value"
      }
    },
    video: {
      type: "zoom",              // or "google-meet", "teams", "none"
      enabled: true,
      config: {
        api_key: "encrypted_value"
      }
    }
  },
  
  // Feature Flags
  features: {
    quote_management: true,
    time_tracking: true,
    materials_tracking: true,
    stock_management: false,       // Not yet needed
    job_photos: true,
    recurring_jobs: true,
    zoom_integration: true,
    geospatial_analytics: true
  },
  
  // Job Types (customizable per trade)
  job_types: [
    "Consumer Unit Replacement",
    "Rewire",
    "Socket Installation",
    "Lighting Installation",
    "Testing & Inspection",
    "Fault Finding",
    "EV Charger Installation"
  ],
  
  // Example for plumber:
  // job_types: ["Boiler Service", "Leak Repair", "Bathroom Install", "Radiator Replacement", "Tap Fitting", "Emergency Callout"]
  
  // Example for plasterer:
  // job_types: ["Skim Coat", "Dry Lining", "Artex Removal", "Coving Installation", "Patch Repair"]
  
  // Example for heating engineer:
  // job_types: ["Boiler Install", "Boiler Service", "Powerflush", "Thermostatic Valve", "System Upgrade", "Emergency Repair"]
  
  // Supplier Monitoring (trade-specific)
  suppliers: [
    {
      name: "LEW Electrical",
      email_domains: ["lew.co.uk"],
      invoice_prefix: "LEW-"
    },
    {
      name: "CEF York",
      email_domains: ["cef.co.uk"],
      invoice_prefix: "CEF-YK-"
    },
    {
      name: "YESSS Electrical",
      email_domains: ["yesss.co.uk"],
      invoice_prefix: "YESSS-"
    },
    {
      name: "NICEIC",
      email_domains: ["niceic.com"],
      invoice_prefix: "NICEIC-"
    }
  ],
  
  // Example for plumber:
  // suppliers: [
  //   { name: "Plumb Center", email_domains: ["plumbcenter.co.uk"], invoice_prefix: "PC-" },
  //   { name: "City Plumbing", email_domains: ["cityplumbing.co.uk"], invoice_prefix: "CP-" },
  //   { name: "Travis Perkins", email_domains: ["travisperkins.co.uk"], invoice_prefix: "TP-" }
  // ]
  
  // Example for plasterer:
  // suppliers: [
  //   { name: "British Gypsum", email_domains: ["british-gypsum.com"], invoice_prefix: "BG-" },
  //   { name: "Jewson", email_domains: ["jewson.co.uk"], invoice_prefix: "JWS-" }
  // ]
  
  // Metadata
  created_at: "2024-12-01T00:00:00Z",
  subscription_tier: "professional",  // For future SaaS pricing
  status: "active"
}
```

**Key Principles:**
- **Zero Hardcoding**: Tom must never write `£60` or `"Bright Sparks"` in the code
- **Database-Driven**: All business rules come from tenant config
- **Encrypted Secrets**: API keys stored encrypted at rest
- **Easy Cloning**: New tenant = copy config, change branding/rules/credentials

### 2.4 Plugin-Based Connector Architecture

**CRITICAL: All third-party services must use pluggable connectors, not hardcoded integrations.**

The system uses a **connector plugin pattern** where each external service is an optional, swappable plugin. This allows:
- Tenants to choose which services they want (pay only for what they use)
- Tom to add new connectors without changing core code
- Alternative providers for the same function (e.g., QuickBooks instead of Xero)
- Easy deprecation if a service shuts down or pricing changes

#### Core Connector Types

**Accounting Connectors** (choose one):
- Xero (primary)
- QuickBooks Online
- Sage
- FreeAgent

**CRM Connectors** (optional):
- Monday.com
- HubSpot
- Pipedrive
- Airtable
- None (use built-in lightweight CRM)

**Calendar Connectors** (choose one):
- Google Calendar (primary)
- Microsoft Outlook Calendar
- Apple Calendar (CalDAV)

**WhatsApp/Messaging Connectors** (optional):
- TimelinesAI
- Twilio
- MessageBird
- None (manual messaging)

**Automation Connectors** (optional):
- Make.com (primary for invoice parsing)
- Zapier
- n8n (self-hosted)
- Built-in simple automation

**Video Call Connectors** (optional):
- Zoom
- Google Meet
- Microsoft Teams
- None (share meeting links manually)

#### Connector Plugin Specification

Each connector is a separate module with standard interface:

```javascript
interface Connector {
  // Metadata
  id: string;              // "xero", "monday", "timelines-ai"
  name: string;            // "Xero"
  type: string;            // "accounting", "crm", "messaging"
  provider: string;        // "Xero Limited"
  
  // Configuration
  requiredConfig: {        // What tenant must provide
    apiKey?: boolean;
    oauthClientId?: boolean;
    webhookUrl?: boolean;
    customFields?: string[];
  };
  
  // Capabilities
  capabilities: {
    read: boolean;         // Can fetch data
    write: boolean;        // Can create/update
    sync: boolean;         // Supports two-way sync
    webhook: boolean;      // Supports webhooks
  };
  
  // Methods (standardized across all connectors of same type)
  init(config: ConnectorConfig): Promise<void>;
  authenticate(): Promise<AuthResult>;
  test(): Promise<boolean>;
  
  // Type-specific methods
  // For Accounting connectors:
  createInvoice?(invoice: Invoice): Promise<InvoiceResult>;
  getContacts?(): Promise<Contact[]>;
  
  // For CRM connectors:
  createLead?(lead: Lead): Promise<LeadResult>;
  getLeads?(filter?: Filter): Promise<Lead[]>;
  
  // For Messaging connectors:
  sendMessage?(to: string, message: string): Promise<MessageResult>;
}
```

#### Available Connectors (Launch)

| Connector | Type | Status | Tenant Cost |
|-----------|------|--------|-------------|
| **Xero** | Accounting | Core (always available) | Xero subscription |
| **Google Calendar** | Calendar | Core | Free |
| **Monday.com** | CRM | Plugin | £8-40/user/month |
| **TimelinesAI** | Messaging | Plugin | £19-79/month |
| **Make.com** | Automation | Plugin | £9-29/month |
| **Zoom** | Video | Plugin | Free-£119/month |
| **Built-in CRM** | CRM | Core | £0 (basic features) |
| **Built-in Messaging** | Messaging | Core | £0 (manual only) |

#### Connector Marketplace (Future)

Tom can build a connector marketplace where:
- Third-party developers build connectors
- Tenants browse and install connectors
- Connectors are versioned and updatable
- Tom takes 20-30% commission on paid connectors
- Open-source connectors available free

---

### 2.6 Connector Comparison Matrix

**Accounting Connectors:**

| Feature | Xero | QuickBooks | Sage | Built-in |
|---------|------|------------|------|----------|
| Invoice creation | ✓ | ✓ | ✓ | ✗ |
| Contact sync | ✓ | ✓ | ✓ | ✗ |
| Quote management | ✓ | ✓ | ✓ | ✗ |
| Payment tracking | ✓ | ✓ | ✓ | ✗ |
| VAT/Tax automation | ✓ | ✓ | ✓ | ✗ |
| Status | **Launch** | Future | Future | N/A |
| Tenant cost | £12-25/mo | £12-30/mo | £25-40/mo | N/A |

**CRM Connectors:**

| Feature | Monday.com | HubSpot | Pipedrive | Built-in |
|---------|------------|---------|-----------|----------|
| Lead tracking | ✓ | ✓ | ✓ | ✓ |
| Contact management | ✓ | ✓ | ✓ | ✓ |
| Sales pipeline | ✓ | ✓ | ✓ | Basic |
| Email integration | ✓ | ✓ | ✓ | ✗ |
| Reporting | Advanced | Advanced | Advanced | Basic |
| Custom fields | ✓ | ✓ | ✓ | Limited |
| Status | **Launch** | Future | Future | **Launch** |
| Tenant cost | £8-40/user | £15-50/user | £12-100/user | **Free** |

**Messaging Connectors:**

| Feature | TimelinesAI | Twilio | Built-in |
|---------|-------------|--------|----------|
| WhatsApp automation | ✓ | ✓ | ✗ |
| SMS | ✗ | ✓ | ✗ |
| Message templates | ✓ | ✓ | ✓ |
| Message history | ✓ | ✓ | ✓ |
| Auto-responses | ✓ | Via code | ✗ |
| Multi-channel | ✓ | ✓ | ✗ |
| Status | **Launch** | Future | **Launch** |
| Tenant cost | £19-79/mo | Pay-per-message | **Free** |

**Calendar Connectors:**

| Feature | Google Cal | Outlook | Apple Cal | Built-in |
|---------|------------|---------|-----------|----------|
| Two-way sync | ✓ | ✓ | ✓ | ✗ |
| Mobile sync | ✓ | ✓ | ✓ | ✓ |
| Conflict detection | ✓ | ✓ | ✓ | ✓ |
| Recurring events | ✓ | ✓ | ✓ | ✓ |
| Reminders | ✓ | ✓ | ✓ | ✓ |
| Status | **Launch** | Future | Future | **Launch** |
| Tenant cost | **Free** | £4-10/user | **Free** | **Free** |

**Automation Connectors:**

| Feature | Make.com | Zapier | n8n | Built-in |
|---------|----------|--------|-----|----------|
| Email monitoring | ✓ | ✓ | ✓ | Limited |
| AI extraction | ✓ | ✓ | ✓ | ✗ |
| Multi-step workflows | ✓ | ✓ | ✓ | ✗ |
| Error handling | ✓ | ✓ | ✓ | Basic |
| Self-hosted option | ✗ | ✗ | ✓ | N/A |
| Status | **Launch** | Future | Future | **Launch** |
| Tenant cost | £9-29/mo | £20-70/mo | Free (self-host) | **Free** |

**Recommended Connector Stacks by Business Size:**

**Solo Trader (Minimal Cost):**
- Accounting: Xero (£12/mo)
- Calendar: Google Calendar (Free)
- CRM: Built-in (Free)
- Messaging: Built-in (Free)
- **Total: £12/month + platform fee**

**Growing Business (Bright Sparks):**
- Accounting: Xero (£25/mo)
- Calendar: Google Calendar (Free)
- CRM: Monday.com (£24/mo for 3 users)
- Messaging: TimelinesAI (£49/mo)
- Automation: Make.com (£9/mo)
- **Total: £107/month + platform fee**

**Established Contractor (5+ Staff):**
- Accounting: Xero (£40/mo)
- Calendar: Google Workspace (£5/user × 5 = £25/mo)
- CRM: HubSpot (£40/user × 5 = £200/mo)
- Messaging: Twilio (£50/mo avg)
- Automation: Zapier (£50/mo)
- **Total: £365/month + platform fee**

---

### 2.7 Authentication Strategy
- **Single Sign-On**: Primary auth via Google Workspace or email/password
- **Per-Connector OAuth**: Each connector manages its own OAuth flow
- **Connector Credentials**: Stored encrypted in connector-specific config
- **Credential Isolation**: Tenant A's Xero tokens completely separate from Tenant B's

---

## 3. Core Features

### 3.1 Job Scheduling & Management

#### Diary View
- **Interactive Calendar**: Day/Week/Month views synced with Google Calendar
- **Drag-and-Drop**: Rescheduling with automatic conflict detection
- **Multi-Operative View**: Filter by team member as business grows
- **Travel Time**: Automatic routing suggestions between jobs

#### Comprehensive Job Record

**Mandatory Fields:**
- Customer (linked to CRM)
- Job type (dropdown: Rewire, Consumer Unit, Socket Installation, Testing, Fault Finding, EV Charger)
- Scheduled date/time
- Estimated duration
- Status (Scheduled → On Route → In Progress → Completed → Invoiced)

**Financial Tracking:**
- Labour hours × £60/hour
- Materials: Bill of Materials (BOM) with supplier costs
- Materials markup: 20% automatic calculation
- Total cost vs invoice value
- Profit margin per job

**Document Management:**
- **Photos**: Mandatory before/after capture (enforced workflow)
  - Before photos required to start job timer
  - After photos required to mark job complete
  - Auto-upload to R2 storage with job reference
- **Files**: PDF repository for certificates, plans, compliance docs
- **Notes**: Internal notes and customer-facing completion notes

**Supplier Integration:**
- Order reference field (e.g., "BS-2412-001")
- Automatic linking when supplier invoice received
- Alert if materials not yet matched to supplier invoice

#### Status Workflow
1. **Scheduled**: Job in diary, customer confirmed
2. **On Route**: Operative travelling (optional GPS tracking)
3. **In Progress**: Timer running, before photos uploaded
4. **Completed**: Work finished, after photos uploaded, costs recorded
5. **Invoiced**: Xero invoice created and sent

### 3.2 Supplier Invoice Automation

**Email Monitoring:**
- Automated monitoring of:
  - hello@brightsparks-york.com
  - frankie@brightsparks-york.com
- Supplier email addresses: LEW Electrical, CEF York, YESSS Electrical, NICEIC

**AI Extraction (via Make.com):**
- Invoice number
- Date
- Supplier name
- Line items (description, quantity, unit price)
- Total amount
- Order reference (if present)

**Job Matching Logic:**
1. Search for order reference in job records
2. If found: Auto-link invoice to job, update BOM costs
3. If multiple matches: Flag for manual review
4. If no match: Create "unallocated materials" entry for manual assignment

**Error Handling:**
- Failed extraction: Email alert to Frankie with original PDF
- Ambiguous job match: Dashboard notification with suggested matches
- Duplicate detection: Alert if same invoice number already processed

**Validation:**
- Compare extracted total vs PDF total (must match within £0.50)
- Flag unusual amounts (>£500 single line item, >£2000 total)

### 3.3 Accounting & Finance (Xero Integration)

#### Invoice Generation
- **One-Click Creation**: From completed job directly to Xero
- **Template Matching**: Uses existing Bright Sparks invoice template
- **Line Items**:
  - Labour: "{hours} hours electrical work @ £60/hour"
  - Materials: Individual items with 20% markup applied
  - Call-out charge: If applicable (minimum 1 hour charge)
- **Payment Terms**: 7 days (configurable)
- **Auto-Send**: Optional immediate email to customer

#### Quote Management
- Create estimates in Xero
- Convert quote to scheduled job when accepted
- Link quote reference to job for tracking conversion rates

#### Two-Way Sync
- **Contacts**: Pull existing customers from Xero, push new ones
- **Items**: Sync material catalogue for consistent pricing
- **Invoices**: Real-time status updates (Sent → Viewed → Paid)
- **Tax Rates**: Use Xero VAT settings (20% standard)

#### Financial Reporting Integration
- Monthly reconciliation: Xero invoices vs completed jobs
- Unbilled work alert: Jobs completed >7 days without invoice
- Payment tracking: Outstanding invoices dashboard

### 3.4 Customer Relationship Management (CRM)

**Central Customer Database (Monday.com):**
- Single source of truth for all customer data
- Sync with Xero contacts (bidirectional)
- Deduplication logic (match on email/phone)

**Customer Record Fields:**
- Name, email, phone, address
- Customer type (Domestic, Commercial, Landlord)
- Source (Google Ads, Referral, Repeat, Facebook)
- Lifetime value (calculated from job history)
- Payment history (average days to pay)

**Lead Management:**
- Lead capture from website form, phone calls, WhatsApp
- Lead status: New → Contacted → Quoted → Won/Lost
- Conversion tracking by source
- Follow-up reminders

**360° Customer View:**
- Complete job history with photos
- All invoices and quotes
- Communication history (calls, messages, emails)
- Notes and preferences

### 3.5 Analytics & Reporting

**Dynamic Dashboard:**

**Financial Overview:**
- Revenue this month vs last month
- Profit margin: Cost vs invoice value
- Outstanding invoices (aging report)
- Average job value

**Operational Metrics:**
- Jobs completed per week
- Average job duration vs estimated
- Materials markup accuracy (estimated vs actual)
- Customer acquisition cost by source

**Operator Performance (when team grows):**
- Jobs completed per operative
- Profit per operative
- Customer satisfaction ratings
- Time efficiency (actual vs estimated hours)

**Geospatial Analysis:**
- Heatmap by postcode (concentration of customers)
- Travel time analysis
- Service area expansion opportunities

**Custom Reports:**
- Filter by: Date range, customer, job type, operative, postcode
- Export to CSV/PDF
- Scheduled email reports (weekly management summary)

### 3.6 Marketing & Communications (TimelinesAI)

**Automated Workflows:**
- Job confirmation (upon scheduling)
- Day-before reminder
- "On the way" notification (when marked "On Route")
- Job completion with photo share
- Invoice sent notification
- Payment reminder (if overdue)
- Review request (after payment received)

**Broadcast Campaigns:**
- Seasonal maintenance reminders
- Service announcements (e.g., EV charger installations)
- Customer appreciation messages

**Response Management:**
- Centralised WhatsApp inbox
- Auto-responses for common queries
- Lead capture from WhatsApp conversations

### 3.7 Remote Operations (Zoom Integration)

**Scheduled Consultations:**
- Book Zoom calls directly from job card
- Calendar integration (auto-add to Google Calendar)
- Automated reminders to customer

**On-Demand Diagnostics:**
- "Video Call" button in job record
- Instant meeting creation
- Screen sharing for troubleshooting guidance
- Recording option for training/documentation

**Use Cases:**
- Pre-job site surveys
- Remote fault diagnosis
- Customer walkthroughs of completed work
- Training new operatives

---

## 4. User Stories

### Frankie (Business Owner)
- **As Frankie**, I want to see profit margin by operative so I can identify top performers and training needs
- **As Frankie**, I want supplier invoices automatically matched to jobs so I never miss charging for materials
- **As Frankie**, I want all customer communications in one place so I can maintain service quality as we grow
- **As Frankie**, I want to see unbilled jobs immediately so cash flow isn't delayed

### Operative (Future Team Member)
- **As an operative**, I want to upload before photos from my phone before starting work so I maintain quality standards
- **As an operative**, I want to see today's schedule with addresses and customer notes so I can plan my route
- **As an operative**, I want to record materials used on-site so invoicing is accurate
- **As an operative**, I want to join a Zoom call with a customer so Frankie can provide remote support

### Customer
- **As a customer**, I want WhatsApp confirmations and updates so I know when to expect the electrician
- **As a customer**, I want to see before/after photos of the work so I have confidence in the quality
- **As a customer**, I want to receive invoices quickly so I can pay promptly

---

## 5. Data Flow Mapping

### Job Lifecycle Data Flow

```
1. LEAD CAPTURE
   Website/Phone/WhatsApp → Monday.com CRM → Notification to Frankie

2. QUOTE CREATION
   CRM Lead → Xero Quote → Email to Customer → Quote Reference in CRM

3. JOB SCHEDULING
   Accepted Quote → Scheduler Job Card → Google Calendar Sync → WhatsApp Confirmation

4. JOB EXECUTION
   Mark "On Route" → WhatsApp "On the way" notification
   Upload Before Photos → Start Timer
   Record Materials Used → Link to Supplier Price List
   Complete Work → Upload After Photos → Stop Timer

5. INVOICE GENERATION
   Completed Job → Calculate Costs (Labour + Materials + Markup)
   → Create Xero Invoice → Auto-send via Email
   → Update CRM with Invoice Reference → WhatsApp "Invoice sent"

6. SUPPLIER RECONCILIATION
   Supplier Email Received → Make.com AI Extraction
   → Match Order Reference to Job → Update BOM Actual Costs
   → Alert if costs exceed estimate

7. PAYMENT TRACKING
   Xero Invoice Status → Update Dashboard
   → If Overdue: Automated WhatsApp Reminder
   → When Paid: Thank you message → Request Review
```

### Integration Triggers

| Event | Trigger | Action | Platform |
|-------|---------|--------|----------|
| New website enquiry | Form submission | Create CRM lead | Monday.com |
| Quote accepted | CRM status change | Create scheduled job | Scheduler |
| Job scheduled | New job created | Add to calendar, send WhatsApp | Google Cal, TimelinesAI |
| Job completed | Status changed | Create Xero invoice | Xero |
| Supplier invoice received | Email arrives | AI extraction, job matching | Make.com |
| Invoice overdue | 14 days past due | Send payment reminder | TimelinesAI |
| Payment received | Xero webhook | Send thank you, request review | TimelinesAI |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: <2 seconds on 4G connection
- Photo upload: <5 seconds per image (with compression)
- Calendar sync: <60 seconds from scheduler to Google Calendar
- Invoice creation: <10 seconds from job to Xero
- **Tenant switching**: <1 second to load different tenant's branding/config

### 6.2 Security
- All API credentials stored in Cloudflare Worker environment variables
- OAuth token refresh automation
- HTTPS only (no unencrypted connections)
- Role-based access control (Owner vs Operative permissions)
- Photo storage with signed URLs (time-limited access)
- **Tenant isolation**: Row-level security enforced at database level
- **Credential encryption**: All API keys encrypted at rest (AES-256)
- **Security audit**: Penetration testing before second tenant onboarded

### 6.3 Reliability
- 99.5% uptime target (99.9% for SaaS offering)
- Graceful degradation if integrations fail:
  - Xero down: Queue invoices locally, sync when restored
  - Google Calendar down: Show scheduler view, sync when restored
  - Monday.com down: Read-only customer data from cache
- Automatic retry logic for failed API calls (3 attempts with exponential backoff)
- **Multi-tenant resilience**: One tenant's integration failure doesn't affect others

### 6.4 Scalability
- Support 1-10 operatives per tenant initially
- Handle 500+ jobs per month per tenant
- Store 10,000+ photos per tenant (with archival strategy after 2 years)
- Maintain performance with 5,000+ customer records per tenant
- **SaaS scalability**: Support 10+ tenants initially, 100+ within 12 months
- **Database partitioning**: Plan for tenant sharding if >50 tenants

### 6.5 Mobile Optimization
- Responsive design: 320px to 2560px viewports
- Touch-friendly interface (minimum 44px tap targets)
- Offline capability for photo capture (sync when online)
- GPS integration for "On Route" tracking
- Camera access for photo upload
- **Branding optimized**: Logo/colours adapt to mobile screen sizes

### 6.6 Data Retention
- Job records: Indefinite (archive after 7 years)
- Photos: 2 years active, then move to cold storage
- Customer data: Comply with GDPR (deletion on request)
- Financial data: 6 years (UK tax requirement)
- **Tenant deletion**: Complete data purge within 30 days if tenant cancels (GDPR)

### 6.7 White-Label Specific Requirements
- **Zero Hardcoding**: No business-specific values in codebase
- **Dynamic Branding**: CSS variables loaded from database, not static files
- **Custom Domains**: Support custom domain per tenant (SSL auto-provisioned via Cloudflare)
- **Tenant Onboarding**: New tenant operational within 30 minutes
- **Configuration UI**: Admin panel for tenant to update their own branding/pricing (Phase 2 feature)
- **Code Maintainability**: Single codebase serves all tenants (no forking)

---

## 7. Acceptance Criteria by Phase

### Phase 0: Discovery & Technical Validation (Days -3 to 0)

**Connector Architecture Planning:**
- [ ] Connector plugin interface specification finalized
- [ ] Database schema for connector configs designed
- [ ] Connector authentication flow (per-connector OAuth) planned
- [ ] Marketplace structure planned (for future connector additions)
- [ ] **Trade-agnostic design confirmed**: No hardcoded "electrical" assumptions
- [ ] **Bright Sparks connector selection confirmed**:
  - Accounting: Xero ✓
  - CRM: Monday.com ✓
  - Messaging: TimelinesAI ✓
  - Calendar: Google Calendar ✓
  - Automation: Make.com ✓
  - Video: Zoom ✓

**Connector API Access Verification:**
- [ ] Xero API credentials obtained, test call successful
- [ ] Monday.com API credentials obtained, test call successful
- [ ] TimelinesAI webhook endpoint configured and tested
- [ ] Google Calendar API quota confirmed (sufficient for 2-way sync)
- [ ] Make.com account created, email monitoring configured
- [ ] Zoom API credentials obtained (if using API vs just meeting links)

**Multi-Tenant Architecture Planning:**
- [ ] Database selection (D1, Turso, or PostgreSQL on edge)
- [ ] Tenant identification strategy confirmed (subdomain vs custom domain)
- [ ] Row-level security approach documented
- [ ] Secrets management strategy (encrypted credentials per tenant, per connector)
- [ ] Domain routing plan (how brightsparks-york.com and acme-electric.com both work)

**Data Flow Mapping:**
- [ ] Complete trigger→action map documented for all connectors
- [ ] Conflict resolution rules defined (e.g., calendar sync conflicts)
- [ ] Error handling procedures documented per connector
- [ ] **Tenant isolation verified**: Customer A cannot see Customer B's data
- [ ] **Connector fallback**: System works if optional connector disabled

**Connector Plugin Development:**
- [ ] Base Connector abstract class created
- [ ] Xero connector plugin implemented (accounting)
- [ ] Google Calendar connector plugin implemented (calendar)
- [ ] Built-in CRM connector implemented (fallback if no Monday.com)
- [ ] Test: Switch between connectors without code changes

### Phase 1: Foundation (Days 1-2)

**Infrastructure:**
- [ ] Vite + React project initialized with TypeScript
- [ ] **Multi-tenant architecture**: Tenant context provider implemented
- [ ] **Connector architecture**: Plugin loader and registry implemented
- [ ] **Database schema**: Tenant config table + connector config tables created
- [ ] Tailwind CSS configured with **dynamic theming support**
- [ ] Basic application shell (header, navigation, layout) renders
- [ ] Mobile responsive layout verified on iPhone and Android

**White-Label Requirements:**
- [ ] Branding loads from tenant config (not hardcoded)
- [ ] CSS variables set dynamically from tenant.branding.primary_color
- [ ] Company name displays from config in header/footer
- [ ] Logo loads from tenant.branding.logo_url
- [ ] **Test with three mock tenants**: 
  - Bright Sparks (electrician, yellow/gold branding)
  - "Acme Plumbing" (plumber, blue branding)
  - "Perfect Plastering" (plasterer, white/grey branding)
- [ ] Switching tenants (via subdomain/domain) changes branding instantly
- [ ] Job types display correctly per trade (electrician sees "Rewire", plumber sees "Boiler Service")

**Connector Management UI:**
- [ ] Settings page shows enabled/disabled connectors
- [ ] "Connect to Xero" button triggers OAuth flow
- [ ] "Connect to Monday.com" button shows API key input
- [ ] Connector status indicators (connected/disconnected/error)
- [ ] Test: Enable/disable connector without breaking core functionality

**Design System:**
- [ ] Colour palette **generated** from tenant config (not static)
- [ ] Typography scale established
- [ ] Button styles created (primary, secondary, danger) using tenant colours
- [ ] Form input components styled with tenant theme

### Phase 2: Scheduler Core + Google Calendar (Days 3-6)

**Calendar Interface:**
- [ ] Day/Week/Month views render correctly
- [ ] Click date to create new job modal
- [ ] Drag-and-drop job rescheduling works
- [ ] Mobile calendar view usable on phone screen

**Job Management:**
- [ ] Create job with all mandatory fields
- [ ] Edit existing job
- [ ] Delete job with confirmation
- [ ] Status workflow dropdown (Scheduled → Completed)

**Photo Logic:**
- [ ] Photo upload from phone camera works on site (test with 4G, not just WiFi)
- [ ] Before photo required before "Start Job" button enables
- [ ] After photo required before "Mark Complete" button enables
- [ ] Photos display in job card with timestamps
- [ ] Compressed upload (<500KB per photo) works reliably

**Google Calendar Sync:**
- [ ] New job appears in Google Calendar within 60 seconds
- [ ] Edit job in scheduler updates Google Calendar
- [ ] Delete job removes from Google Calendar
- [ ] Changes in Google Calendar reflect in scheduler (two-way sync)
- [ ] Conflict detection: Alert if double-booked

**Real Data Test:**
- [ ] Schedule 5 real jobs from current pipeline
- [ ] Upload photos from phone at an actual job site
- [ ] Verify sync with personal Google Calendar

### Phase 2.5: Supplier Invoice Automation (Days 7-8)

**Email Monitoring:**
- [ ] Make.com scenario monitors hello@ and frankie@ inboxes
- [ ] Filter triggers on emails from LEW, CEF, YESSS, NICEIC
- [ ] Test with 3 real supplier invoices forwarded

**AI Extraction:**
- [ ] Extract invoice number, date, supplier, total from PDF
- [ ] Extract line items (description, quantity, price)
- [ ] Extract order reference if present
- [ ] Validation: Extracted total matches PDF total within £0.50

**Job Matching:**
- [ ] Order reference "BS-2412-001" finds correct job
- [ ] No match creates "unallocated materials" entry
- [ ] Multiple matches flag for manual review
- [ ] Dashboard shows unallocated materials count

**Error Handling:**
- [ ] Failed extraction sends alert email to Frankie with PDF attached
- [ ] Duplicate invoice number detected and alerts
- [ ] Test with intentionally malformed PDF

**Acceptance Test:**
- [ ] Forward 3 real supplier invoices
- [ ] Verify 100% extraction accuracy
- [ ] Confirm job matching works for 2/3 (1 intentionally unmatched)

### Phase 3: Accounting Connector Integration (Days 9-12)

**Xero Connector Implementation:**
- [ ] Xero connector plugin fully implemented
- [ ] OAuth flow initiated from connector settings page
- [ ] OAuth callback handled, tokens stored encrypted
- [ ] Test connection button verifies Xero access

**Contact Sync:**
- [ ] Fetch all existing Xero contacts on first load
- [ ] Display contacts in customer dropdown
- [ ] Create new contact in Xero from scheduler
- [ ] Sync new contact back to scheduler
- [ ] Test with 1 real customer (compare Xero record)

**Invoice Creation:**
- [ ] Complete job generates correct line items:
  - Labour hours × hourly rate (from tenant config)
  - Materials with markup % (from tenant config)
  - Minimum charge applied (from tenant config)
- [ ] Invoice appears in Xero within 10 seconds
- [ ] Invoice uses correct Bright Sparks template
- [ ] Payment terms set from tenant config
- [ ] Customer email pre-filled

**Quote Management:**
- [ ] Create quote in Xero from scheduler
- [ ] Convert quote to job when accepted
- [ ] Link quote reference in job record

**Connector Flexibility Testing:**
- [ ] Test with Xero connector disabled (system still functions)
- [ ] Manual invoice entry available if Xero unavailable
- [ ] **Future-proofing**: Document how to add QuickBooks connector later

**Validation:**
- [ ] Create invoice for November job, compare to manual calculation
- [ ] Verify VAT calculated correctly (from tenant.pricing.vat_rate)
- [ ] Confirm invoice number sequence follows Xero settings

### Phase 4: CRM & Customer View (Days 13-16)

**CRM Connector Selection:**
- [ ] Built-in lightweight CRM implemented (fallback option)
- [ ] Monday.com connector plugin implemented
- [ ] Tenant can choose: Monday.com OR Built-in CRM OR None
- [ ] Settings UI allows switching between CRM connectors

**Monday.com Connector (if enabled):**
- [ ] OAuth or API key authentication
- [ ] Fetch all CRM contacts on load
- [ ] Create new lead in Monday.com from scheduler
- [ ] Sync customer from Xero to Monday.com (deduplicate by email)
- [ ] Update lead status (New → Contacted → Quoted → Won)

**Built-in CRM (always available):**
- [ ] Simple customer database stored locally
- [ ] Basic lead tracking (source, status, notes)
- [ ] Export to CSV for migration to full CRM later
- [ ] Import from CSV (for tenants migrating data)

**360° Customer View (works with any CRM connector):**
- [ ] Customer detail page shows all jobs
- [ ] Display job photos in timeline
- [ ] Show all invoices linked to customer
- [ ] Communication history (if messaging connector enabled)
- [ ] Notes and preferences

**Lead Management:**
- [ ] Capture lead from website form (test submission)
- [ ] Assign lead source (Google Ads, Referral, etc.)
- [ ] Follow-up reminder system (works without CRM connector)
- [ ] Conversion tracking (Lead → Quote → Job → Invoice)

**Connector Comparison Test:**
- [ ] Test with Monday.com enabled: Full CRM features
- [ ] Test with Built-in CRM: Basic features work
- [ ] Test with no CRM connector: Manual tracking only
- [ ] Verify data migration path if switching connectors

### Phase 5: Marketing & Analytics (Days 17-21)

**Messaging Connector Implementation:**
- [ ] Built-in messaging (manual) implemented (fallback)
- [ ] TimelinesAI connector plugin implemented
- [ ] Twilio connector plugin implemented (alternative)
- [ ] Tenant can choose messaging connector in settings

**TimelinesAI Connector (if enabled):**
- [ ] Send test WhatsApp message via API
- [ ] Automated workflow: Job confirmation message upon scheduling
- [ ] Day-before reminder sends at 6 PM
- [ ] "On the way" notification when status = "On Route"
- [ ] Job completion message with link to photos
- [ ] Invoice sent notification
- [ ] Payment reminder for overdue invoices (14 days)

**Built-in Messaging (always available):**
- [ ] Manual message templates
- [ ] Copy-paste friendly message generation
- [ ] Message history log (even if sent manually)
- [ ] SMS fallback option (via Twilio connector if enabled)

**Automation Connector:**
- [ ] Make.com connector for supplier invoice parsing
- [ ] Zapier connector as alternative
- [ ] Built-in simple rule engine (for basic automations without external service)
- [ ] Test switching between Make.com and Zapier

**Dashboard - Financial:**
- [ ] Revenue this month (from accounting connector - Xero)
- [ ] Profit margin: Total costs vs total invoice value
- [ ] Outstanding invoices with aging (0-30, 30-60, 60+ days)
- [ ] Chart: Monthly revenue trend (last 6 months)

**Dashboard - Operational:**
- [ ] Jobs completed this week vs last week
- [ ] Average job duration vs estimated
- [ ] Materials markup accuracy percentage
- [ ] Top 5 customers by revenue

**Reports:**
- [ ] Filter jobs by: Date range, customer, job type
- [ ] Export to CSV with all job details
- [ ] Geospatial heatmap by postcode (if time permits)

**Connector Status Dashboard:**
- [ ] Visual indicator of which connectors are active
- [ ] Last sync time per connector
- [ ] Error alerts if connector fails
- [ ] One-click re-authentication if OAuth expired

**Real Data Test:**
- [ ] Run profit report for November 2024
- [ ] Compare to manual spreadsheet calculation
- [ ] Verify accuracy within £50

**Reports:**
- [ ] Filter jobs by date range, customer, job type
- [ ] Export to CSV with all job details
- [ ] Geospatial heatmap by postcode (if time permits)

**Real Data Test:**
- [ ] Run profit report for November 2024
- [ ] Compare to manual spreadsheet calculation
- [ ] Verify accuracy within £50

### Phase 6: Polish & Zoom (Days 22-25)

**Zoom Integration:**
- [ ] "Schedule Video Call" button in job card
- [ ] Creates Zoom meeting, adds to Google Calendar
- [ ] "Join Call" button opens Zoom in browser
- [ ] Test call with Tom or trusted contact

**Mobile Optimization:**
- [ ] Full app tested on iPhone (Safari) and Android (Chrome)
- [ ] Photo upload speed test on 4G at job site
- [ ] All forms usable with on-screen keyboard
- [ ] Calendar scrolling smooth on mobile

**Performance:**
- [ ] Lighthouse score >90 on mobile
- [ ] Page load <2 seconds on 4G
- [ ] Photo upload <5 seconds per image

**Bug Fixes:**
- [ ] Review all Phase 5 issues
- [ ] Resolve critical bugs
- [ ] Address UX feedback from Frankie

### Phase 7: UAT & Training (Days 26-30)

**User Acceptance Testing:**
- [ ] Frankie completes 10 real jobs end-to-end using system
- [ ] Test all workflows: Quote → Job → Invoice → Payment tracking
- [ ] Verify all integrations work in production environment
- [ ] Test failure scenarios (e.g., Xero temporarily unavailable)

**Documentation:**
- [ ] User guide for daily operations
- [ ] Operative onboarding checklist
- [ ] Troubleshooting guide for common issues
- [ ] Video walkthrough of key workflows

**Training:**
- [ ] Frankie walkthrough session with Tom
- [ ] Practice session: Create job, upload photos, generate invoice
- [ ] Review analytics dashboard interpretation

**Launch Checklist:**
- [ ] All Phase 0-6 acceptance criteria met
- [ ] Backup system tested (export all data)
- [ ] Support contact (Tom) confirmed
- [ ] Rollback plan documented

---

## 8. Fallback Procedures

### Integration Failure Responses

**Xero API Unavailable:**
- Display warning banner: "Xero connection unavailable - invoices will sync when restored"
- Queue invoice creation requests locally
- Auto-retry every 15 minutes
- Manual sync button for user-initiated retry
- Email alert to Frankie if failure persists >2 hours

**Google Calendar Sync Failure:**
- Scheduler remains primary source of truth
- Display jobs from local database
- Queue calendar updates
- Sync when connection restored
- No data loss (calendar is view only, not source)

**Monday.com CRM Unavailable:**
- Display cached customer data (read-only)
- New customer creation queued
- Warning: "CRM sync pending"
- Manual retry option

**TimelinesAI WhatsApp Failure:**
- Log failed message to dashboard
- Manual resend option
- Email fallback for critical notifications
- Alert Frankie if failure persists

**Make.com Invoice Parser Down:**
- Supplier invoices accumulate in inbox
- Manual entry workflow available
- Alert when processing resumes
- Batch process queued invoices

### Manual Override Processes

**Emergency Invoice Creation:**
- If Xero unavailable, create invoice manually in Xero
- Return to system, enter Xero invoice number
- Mark job as "Manually Invoiced"
- System will reconcile when connection restored

**Customer Data Not Syncing:**
- Create customer locally in scheduler
- Flag for manual Xero/CRM sync later
- Use scheduler as immediate source of truth

**Photo Upload Failure:**
- Save photos locally on device
- Upload when connectivity improves
- Alert if photos not uploaded within 24 hours

---

## 9. Field Mapping Reference

**Cross-Platform Customer Data:**

| Scheduler Field | Xero Field | Monday.com Field | TimelinesAI Field |
|-----------------|------------|------------------|-------------------|
| Customer Name | ContactName | Name | Contact Name |
| Email | EmailAddress | Email | WhatsApp Email |
| Phone | Phone | Phone | Phone Number |
| Address Line 1 | AddressLine1 | Address | Address |
| Postcode | PostalCode | Postcode | - |
| Customer Type | - | Customer Type | Tag |
| Notes | - | Notes | Notes |

**Job to Invoice Mapping (Scheduler → Xero):**

| Scheduler Field | Xero Invoice Field |
|-----------------|---------------------|
| Customer | Contact |
| Job Date | InvoiceDate |
| Labour Hours | LineItem.Quantity (Description: "Electrical Work") |
| £60/hour | LineItem.UnitAmount |
| Materials List | LineItems (separate line per item) |
| Materials Cost × 1.2 | LineItem.UnitAmount (with markup applied) |
| Total Cost | - (internal only) |
| Notes | Reference field |
| Job Reference | InvoiceNumber prefix (e.g., "BS-2412-001") |

---

## 10. Pricing Rules Reference

**IMPORTANT: These are Bright Sparks' specific values. Tom must NOT hardcode these - they come from tenant configuration.**

**For Bright Sparks tenant config:**

### Labour Pricing
- Standard rate: £60/hour *(from `tenant.pricing.hourly_rate`)*
- Minimum charge: 1 hour *(from `tenant.pricing.minimum_charge_hours`)*
- Rounding: Round up to nearest 0.5 hour *(from `tenant.pricing.time_rounding`)*
  - Example: 2 hours 20 minutes = 2.5 hours = £150

### Materials Pricing
- Cost from supplier invoice (exact)
- Markup: +20% on all materials *(from `tenant.pricing.materials_markup`)*
- Rounding: Round to nearest penny
  - Example: £45.50 cost × 1.2 = £54.60 charged

### Call-Out Charges
- Standard: None (included in hourly rate)
- Emergency (out of hours): +£50 flat fee *(to be added to tenant config later)*

### VAT
- Standard rate: 20% *(from `tenant.pricing.vat_rate`)* on all labour and materials
- Invoice subtotal + VAT = Total due

### Payment Terms
- Standard: 7 days from invoice date *(from `tenant.payment_terms.standard_days`)*
- Overdue reminder: 14 days *(from `tenant.payment_terms.overdue_reminder_days`)*
- Late payment: Not currently charged *(from `tenant.payment_terms.late_payment_fee`)*

### Example Calculation (Bright Sparks)
```
Job: Consumer unit replacement
Labour: 3.5 hours × £60 = £210
Materials:
  - Consumer unit: £120 cost → £144 (+ 20%)
  - Cable: £35 cost → £42 (+ 20%)
  - Sundries: £15 cost → £18 (+ 20%)
Materials total: £204

Subtotal: £414
VAT (20%): £82.80
Total: £496.80
Payment due: 7 days from invoice date
```

**For other tenants:** Same calculation logic, different values from their tenant config.

Example: "Acme Electric" might have:
- Hourly rate: £75/hour
- Materials markup: 25%
- Payment terms: 30 days
- Result: Same job = £584.10 (different pricing, same logic)

---

## 11. Sample Data Pack

**For testing during development:**

### Test Customers
1. **John Smith**
   - Email: john.smith@example.com
   - Phone: 07700 900123
   - Address: 15 Acomb Road, York, YO24 4AB
   - Type: Domestic
   - Jobs: 2 previous (Consumer unit 2023, Socket installation 2024)

2. **York Property Management Ltd**
   - Email: info@yorkpm.example.com
   - Phone: 01904 123456
   - Address: 42 Bishopthorpe Road, York, YO23 1NA
   - Type: Commercial
   - Jobs: Monthly PAT testing contract

3. **Sarah Johnson**
   - Email: sarah.j@example.com
   - Phone: 07700 900456
   - Address: 8 Fulford Road, York, YO10 4BD
   - Type: Domestic
   - Jobs: New customer (lead from Google Ads)

### Test Jobs
1. **Consumer Unit Replacement - John Smith**
   - Date: 15 Dec 2024, 09:00
   - Duration: 4 hours
   - Materials: Consumer unit (£120), cable (£35), sundries (£15)
   - Status: Completed
   - Photos: Before/After available

2. **Socket Installation - Sarah Johnson**
   - Date: 16 Dec 2024, 14:00
   - Duration: 2 hours
   - Materials: Double socket (£8 × 3), cable (£12)
   - Status: Scheduled

3. **PAT Testing - York Property Management**
   - Date: 18 Dec 2024, 08:00
   - Duration: 6 hours
   - Materials: Test labels (£5)
   - Status: Scheduled
   - Recurring: Monthly

### Test Supplier Invoices
(Real PDFs to be provided by Frankie for Make.com testing)

1. **LEW Electrical**
   - Invoice: LEW-2024-5678
   - Date: 14 Dec 2024
   - Order Ref: BS-2412-001
   - Items: Consumer unit £120, Cable 10m £35
   - Total: £155

2. **CEF York**
   - Invoice: CEF-YK-9876
   - Date: 14 Dec 2024
   - Order Ref: BS-2412-002
   - Items: Double sockets ×3 £24, Cable 5m £12
   - Total: £36

3. **YESSS Electrical**
   - Invoice: YESSS-12345
   - Date: 15 Dec 2024
   - Order Ref: (none - unmatched test)
   - Items: Sundry materials £45
   - Total: £45

---

## 12. Success Metrics

### Launch Metrics (First 30 Days - Bright Sparks)
- [ ] 100% of jobs scheduled in system (no paper diary)
- [ ] 95%+ invoice creation within 24 hours of job completion
- [ ] 90%+ supplier invoices automatically matched to jobs
- [ ] Zero missed material charges (unbilled materials)
- [ ] Frankie confident using system without Tom's support

### White-Label Validation (First 30 Days)
- [ ] Second test tenant created with different branding
- [ ] Tenant isolation verified: No data leakage between tenants
- [ ] Custom domain routing working (brightsparks-york.com)
- [ ] Branding changes in tenant config reflect instantly in UI
- [ ] All business logic uses tenant config (no hardcoded values)

### 3-Month Metrics (Bright Sparks)
- [ ] Administrative time reduced by 50% (vs manual process)
- [ ] Average job profitability known within 48 hours
- [ ] Customer communication 100% via automated WhatsApp
- [ ] All customer data centralized (no spreadsheets)
- [ ] System ready for first operative hire

### 6-Month Metrics (Bright Sparks)
- [ ] Support 2-3 operatives with individual logins
- [ ] Operative performance metrics visible in dashboard
- [ ] 1000+ jobs tracked in system
- [ ] Customer retention rate tracked and improving
- [ ] ROI positive (time saved > platform costs of £65/month)

### 6-Month Metrics (White-Label / SaaS Readiness)
- [ ] Documentation for onboarding new tenants complete
- [ ] Tenant creation process takes <30 minutes
- [ ] Second paying customer using the system (if Tom pursues SaaS)
- [ ] 99.9% uptime across all tenants
- [ ] Support ticket system in place for multi-tenant support

---

## 13. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API rate limits exceeded | High | Medium | Implement caching, batch requests, monitor usage **per tenant** |
| Photo storage costs escalate | Medium | Low | Compress uploads, archive old photos to cold storage |
| Integration breaks after platform updates | High | Medium | Monitor platform changelogs, maintain fallback procedures |
| Mobile upload fails on poor signal | High | Medium | Queue uploads, retry logic, offline capability |
| Xero sync creates duplicate invoices | High | Low | Idempotency keys, duplicate detection logic |
| Supplier invoice extraction inaccurate | Medium | Medium | Human review workflow, confidence scoring |
| Tom unavailable for support | High | Low | Comprehensive documentation, identify backup developer |
| User adoption resistance (future operatives) | Medium | Medium | Gradual rollout, training, gather feedback |
| **Tenant data leakage** | **Critical** | **Low** | **Row-level security, comprehensive security audit, penetration testing** |
| **Hardcoded business logic discovered** | **High** | **Medium** | **Code review checklist, test with multiple tenants during development** |
| **Tenant wants custom domain SSL** | **Medium** | **High** | **Cloudflare automatic SSL, document custom domain setup process** |
| **Second tenant needs different job types** | **Medium** | **High** | **Job types stored in tenant config (already planned)** |
| **Scaling costs exceed revenue (if SaaS)** | **High** | **Low** | **Monitor per-tenant costs, tiered pricing based on usage** |

---

## 14. Post-Launch Support Plan

### Phase 8: First Month Support (Days 31-60)

**Week 1 (Daily Check-ins):**
- [ ] Monitor all integrations for errors
- [ ] Review failed automation attempts
- [ ] Gather Frankie's feedback on UX issues
- [ ] Quick bug fixes for critical issues

**Week 2-4 (Weekly Check-ins):**
- [ ] Refinement of automation rules based on real usage
- [ ] Adjust AI extraction confidence thresholds
- [ ] Performance optimization based on actual data load
- [ ] Plan for feature enhancements

**Ongoing Support:**
- Email support: Within 24 hours
- Critical bugs: Within 4 hours
- Feature requests: Logged for quarterly review
- Monthly review call: System performance and roadmap

---

## 15. Future Enhancements (Post-Launch)

**Quarter 2 2025:**
- Multi-operative scheduling with conflict detection
- Operative mobile app (native iOS/Android)
- Customer portal (view job history, pay invoices)
- Automated quote generation from job templates
- **Tenant admin panel**: Self-service branding/config updates
- **Connector marketplace**: Browse and install connectors from UI

**Quarter 3 2025:**
- Stock management with low-stock alerts
- Purchase order system for supplier orders
- Advanced analytics (profit trends, customer lifetime value)
- Integration with vehicle tracking (mileage for tax)
- **SaaS marketplace**: Tom can sell to other electrical contractors
- **Additional connectors**: QuickBooks, Sage, HubSpot, Twilio

**Quarter 4 2025:**
- Customer review management (Google, Trustpilot)
- Compliance certificate storage and renewal alerts
- Recurring job automation (annual EICR reminders)
- Team communication (chat, task assignments)
- **White-label mobile apps**: Custom branded iOS/Android apps per tenant
- **Third-party connector SDK**: Let others build connectors

**SaaS Revenue Model (Future):**

**Base Subscription:**
- Starter: £99/month (solo trader, any trade)
- Professional: £199/month (small team, 2-5 operatives)
- Enterprise: £399/month (larger teams, 6+ operatives)

**Connector Add-ons (à la carte):**
- Premium CRM Connector (Monday.com, HubSpot): +£20/month
- Premium Messaging (TimelinesAI, Twilio): +£15/month
- Advanced Automation (Make.com, Zapier): +£10/month
- Video Calls (Zoom, Teams): +£10/month

**Example Pricing by Trade:**
- **Electrician** (Bright Sparks): Professional (£199) + All connectors (£55) = £254/month
- **Solo plumber**: Starter (£99) + No connectors (uses built-ins) = £99/month
- **Large building firm** (8 staff): Enterprise (£399) + All connectors (£55) = £454/month
- **Heating engineer** (3 staff): Professional (£199) + Messaging only (£15) = £214/month

**UK Market Size & Revenue Potential:**

| Trade | UK Businesses | @ 1% Penetration | @ 5% Penetration | @ 10% Penetration |
|-------|---------------|------------------|------------------|-------------------|
| **Electricians** | 250,000 | 2,500 × £200 = **£500k/mo** | 12,500 × £200 = **£2.5M/mo** | 25,000 × £200 = **£5M/mo** |
| **Plumbers** | 150,000 | 1,500 × £200 = **£300k/mo** | 7,500 × £200 = **£1.5M/mo** | 15,000 × £200 = **£3M/mo** |
| **Heating Engineers** | 80,000 | 800 × £200 = **£160k/mo** | 4,000 × £200 = **£800k/mo** | 8,000 × £200 = **£1.6M/mo** |
| **Builders** | 200,000 | 2,000 × £200 = **£400k/mo** | 10,000 × £200 = **£2M/mo** | 20,000 × £200 = **£4M/mo** |
| **Plasterers** | 50,000 | 500 × £200 = **£100k/mo** | 2,500 × £200 = **£500k/mo** | 5,000 × £200 = **£1M/mo** |
| **Gas Engineers** | 80,000 | 800 × £200 = **£160k/mo** | 4,000 × £200 = **£800k/mo** | 8,000 × £200 = **£1.6M/mo** |
| **Roofers** | 40,000 | 400 × £200 = **£80k/mo** | 2,000 × £200 = **£400k/mo** | 4,000 × £200 = **£800k/mo** |
| **Decorators** | 60,000 | 600 × £200 = **£120k/mo** | 3,000 × £200 = **£600k/mo** | 6,000 × £200 = **£1.2M/mo** |
| **TOTAL** | **910,000** | **9,100** = **£1.82M/mo** | **45,500** = **£9.1M/mo** | **91,000** = **£18.2M/mo** |

**Annual Revenue Projections:**
- **1% market penetration**: £21.8M/year
- **5% market penetration**: £109M/year
- **10% market penetration**: £218M/year

**Conservative Target (Year 1):** 
- 100 customers across all trades = £20,000/month = **£240,000/year**
- Focus: Electricians (50), Plumbers (30), Heating (10), Others (10)

**Realistic Target (Year 3):**
- 1,000 customers = £200,000/month = **£2.4M/year**
- Multi-trade diversification reduces risk

**Connector Revenue Share:**
- Tom builds connector: 100% revenue
- Third-party builds connector: 70% to developer, 30% to Tom (platform fee)

**Bright Sparks Lifetime Benefit:**
- Forever free Professional plan (£199/month value)
- Forever free all connector add-ons (£55/month value)
- Total lifetime value: £3,048/year saved
- Priority support and feature requests
- Case study rights (marketing)

---

## 16. Constraints & Assumptions

### Constraints
- Budget: Platform costs £65/month (Monday.com, TimelinesAI, Make.com)
- Timeline: 30 working days (6 weeks) to launch
- Team: Solo developer (Tom), solo tester (Frankie initially)
- Existing systems: Must integrate with current Xero subscription

### Assumptions
- Frankie will provide real data for testing (customers, jobs, invoices)
- Supplier invoice formats remain consistent
- Internet connectivity available at most job sites (4G minimum)
- Google Workspace account available for SSO
- Operatives will have smartphones for photo upload

### Dependencies
- Tom's availability for development (confirmed)
- API access to all platforms (to be verified in Phase 0)
- Frankie's time for UAT and feedback (2-3 hours/week)
- Supplier cooperation (email invoice format unchanged)

---

## 17. Trade-Specific Adaptations

**How the system adapts to different trades without code changes:**

### Universal Core Features (All Trades)
- Job scheduling and calendar management
- Customer database and 360° view
- Invoice creation and payment tracking
- Photo documentation (before/after)
- Supplier invoice automation
- Team/operative management
- Analytics and reporting

### Trade-Specific Configuration

**1. Job Types Examples:**
- **Electrician**: Consumer Unit, Rewire, Socket Install, Testing, EV Charger
- **Plumber**: Boiler Service, Leak Repair, Bathroom Install, Tap Fitting
- **Plasterer**: Skim Coat, Dry Lining, Artex Removal, Coving
- **Heating Engineer**: Boiler Install, Powerflush, Gas Safety Check
- **Builder**: Extension, Loft Conversion, Kitchen Fit, Foundation Work
- **Decorator**: Interior Painting, Wallpapering, Exterior Painting

**2. Pricing Models:**
- Hourly (electricians, plumbers): £40-80/hour
- Day rate (plasterers, decorators): £200-300/day
- Mixed (builders, heating): Both hourly and day rate options
- Materials markup: 5-25% depending on trade norms

**3. Industry Certifications:**
- **Electrician**: NICEIC, NAPIT, Part P
- **Gas Engineer**: Gas Safe Register (legally required)
- **Plumber**: WaterSafe, CIPHE
- **Heating**: OFTEC, Gas Safe
- **Roofer**: CompetentRoofer, NFRC

**4. Trade-Specific Suppliers:**
- **Electricians**: LEW, CEF, YESSS, TLC Direct
- **Plumbers**: Plumb Center, City Plumbing, Wolseley
- **Plasterers**: British Gypsum, Jewson, Travis Perkins
- **Builders**: Travis Perkins, Jewson, Buildbase

All configurable per tenant - no hardcoded assumptions.

---

## 18. Connector Development Guidelines

**For Tom when building new connectors:**

### Standard Connector Structure

Every connector must implement this structure:

```typescript
// /src/connectors/xero/index.ts
export class XeroConnector implements AccountingConnector {
  
  // Metadata (displayed in UI)
  static metadata = {
    id: 'xero',
    name: 'Xero',
    type: 'accounting',
    provider: 'Xero Limited',
    icon: '/connectors/xero-icon.svg',
    description: 'Connect to Xero for invoicing and contact management',
    website: 'https://www.xero.com',
    requiredConfig: {
      oauthClientId: true,
      oauthClientSecret: true,
    },
    capabilities: {
      read: true,
      write: true,
      sync: true,
      webhook: true,
    },
  };
  
  // Lifecycle methods
  async init(config: ConnectorConfig): Promise<void> {
    // Initialize connector with tenant-specific config
    this.config = config;
    this.client = new XeroClient(config.clientId, config.clientSecret);
  }
  
  async authenticate(): Promise<AuthResult> {
    // Handle OAuth flow
    // Return access token and refresh token
  }
  
  async test(): Promise<boolean> {
    // Test connection (e.g., GET /organization)
    // Return true if connected, false otherwise
  }
  
  async disconnect(): Promise<void> {
    // Revoke tokens, cleanup
  }
  
  // Type-specific methods (Accounting)
  async createInvoice(invoice: Invoice): Promise<InvoiceResult> {
    // Map internal Invoice format to Xero format
    // Call Xero API
    // Return result with Xero invoice ID
  }
  
  async getContacts(filter?: Filter): Promise<Contact[]> {
    // Fetch contacts from Xero
    // Map to internal Contact format
    // Return array
  }
  
  async getInvoice(id: string): Promise<Invoice> {
    // Fetch single invoice
  }
  
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<InvoiceResult> {
    // Update existing invoice
  }
  
  // Error handling
  private handleError(error: any): ConnectorError {
    // Standardize error format
    // Log to monitoring
    // Return user-friendly error
  }
}
```

### Connector Registration

```typescript
// /src/connectors/registry.ts
import { XeroConnector } from './xero';
import { MondayConnector } from './monday';
import { TimelinesConnector } from './timelines';

export const connectorRegistry = {
  accounting: {
    xero: XeroConnector,
    quickbooks: QuickBooksConnector, // Future
  },
  crm: {
    monday: MondayConnector,
    builtin: BuiltInCRMConnector,
  },
  messaging: {
    'timelines-ai': TimelinesConnector,
    builtin: BuiltInMessagingConnector,
  },
  // ... etc
};
```

### Connector Testing Checklist

For each new connector:

- [ ] **Unit tests**: 90%+ coverage
- [ ] **Integration tests**: Test against real API (sandbox)
- [ ] **Error handling**: All API errors caught and standardized
- [ ] **Rate limiting**: Respect API rate limits
- [ ] **Retry logic**: Exponential backoff for failed requests
- [ ] **Logging**: All API calls logged for debugging
- [ ] **Monitoring**: Track success/failure rates
- [ ] **Documentation**: User guide for configuring connector
- [ ] **OAuth flow**: Test full authorization flow
- [ ] **Token refresh**: Auto-refresh expired tokens
- [ ] **Webhook handling**: If supported by API
- [ ] **Multi-tenant**: Works with multiple tenants simultaneously
- [ ] **Graceful degradation**: App works if connector disabled
- [ ] **Migration path**: Can switch from Connector A to Connector B

### Connector Configuration UI

Each connector gets a settings page:

```jsx
// /src/components/connectors/XeroSettings.tsx
export function XeroSettings({ tenant }) {
  const connector = tenant.connectors.accounting;
  
  return (
    <ConnectorCard
      name="Xero"
      icon="/connectors/xero-icon.svg"
      status={connector.enabled ? 'connected' : 'disconnected'}
    >
      {!connector.enabled ? (
        <Button onClick={handleConnect}>
          Connect to Xero
        </Button>
      ) : (
        <>
          <Status>
            Last synced: {connector.lastSync}
          </Status>
          <Button variant="secondary" onClick={handleDisconnect}>
            Disconnect
          </Button>
          <Button variant="danger" onClick={handleReauthorize}>
            Reauthorize
          </Button>
        </>
      )}
      
      <Settings>
        <Checkbox
          label="Auto-sync contacts"
          checked={connector.config.autoSyncContacts}
          onChange={handleToggleAutoSync}
        />
        <Select
          label="Default tax rate"
          options={taxRates}
          value={connector.config.defaultTaxRate}
        />
      </Settings>
    </ConnectorCard>
  );
}
```

### Data Mapping Standards

**Internal format is source of truth:**

```typescript
// Internal Invoice format
interface Invoice {
  id: string;
  customer: Customer;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

// Connector maps to/from external format
class XeroConnector {
  private mapToXero(invoice: Invoice): XeroInvoice {
    return {
      Type: 'ACCREC',
      Contact: { ContactID: invoice.customer.externalId },
      LineItems: invoice.lineItems.map(item => ({
        Description: item.description,
        Quantity: item.quantity,
        UnitAmount: item.unitPrice,
        AccountCode: '200', // Sales
        TaxType: 'OUTPUT2', // 20% VAT
      })),
      Date: invoice.dueDate.toISOString(),
      DueDate: invoice.dueDate.toISOString(),
      Status: this.mapStatus(invoice.status),
    };
  }
  
  private mapFromXero(xeroInvoice: XeroInvoice): Invoice {
    // Reverse mapping
  }
}
```

### Connector Versioning

Each connector has a version:

```typescript
static metadata = {
  id: 'xero',
  name: 'Xero',
  version: '1.2.0', // Semantic versioning
  apiVersion: 'v2.0', // Xero API version
  // ...
};
```

**Version policy:**
- **Patch** (1.2.0 → 1.2.1): Bug fixes, no breaking changes
- **Minor** (1.2.1 → 1.3.0): New features, backwards compatible
- **Major** (1.3.0 → 2.0.0): Breaking changes, migration required

### Connector Security

**Credential storage:**
```typescript
// NEVER store in code
const BAD = {
  apiKey: 'abc123', // ❌ Never do this
};

// ALWAYS encrypt in database
const GOOD = await encryptCredential(tenant.id, 'xero', {
  clientId: credentials.clientId,
  clientSecret: credentials.clientSecret,
}); // ✓ Encrypted per tenant
```

**Access control:**
```typescript
// Verify tenant owns the connector config
async function loadConnector(tenantId: string, connectorId: string) {
  const config = await db.connectorConfigs
    .where('tenant_id', tenantId)
    .where('connector_id', connectorId)
    .first();
  
  if (!config) {
    throw new Error('Unauthorized connector access');
  }
  
  return config;
}
```

### Connector Monitoring

Each connector should emit events:

```typescript
// Successful API call
connectorMonitor.track({
  tenant: tenant.id,
  connector: 'xero',
  action: 'createInvoice',
  success: true,
  duration: 234, // ms
});

// Failed API call
connectorMonitor.track({
  tenant: tenant.id,
  connector: 'xero',
  action: 'createInvoice',
  success: false,
  error: 'Rate limit exceeded',
  duration: 1200,
});
```

**Alerting thresholds:**
- Error rate >5%: Email alert to Tom
- Error rate >20%: Disable connector, alert tenant
- Response time >5s: Performance alert
- Auth failures: Prompt tenant to reauthorize

---

## 18. White-Label Tenant Onboarding Process

**When Tom onboards a new electrical contractor to the system:**

### Step 1: Initial Setup (10 minutes)
1. Create new tenant record in database
2. Assign tenant_id (e.g., "acme-electric-york")
3. Set up subdomain (acme-electric-york.the-platform.com) or custom domain
4. Generate secure authentication credentials

### Step 2: Branding Configuration (10 minutes)
1. **Collect from new customer:**
   - Company name
   - Logo (PNG/SVG, transparent background preferred)
   - Primary brand colour (hex code)
   - Contact details (email, phone, address)
   - VAT number (if applicable)

2. **Upload to system:**
   - Logo to R2/S3 storage
   - Update tenant.branding config
   - Preview site to verify branding applied correctly

### Step 3: Business Rules Configuration (5 minutes)

**Trade Selection:**
- [ ] Choose primary trade: Electrical / Plumbing / Plastering / Heating / Building / Gas / Roofing / Decorating / Landscaping / Other
- [ ] This determines default job types and compliance requirements

**1. Pricing:**
- [ ] **Pricing model**: Hourly / Day rate / Fixed price / Mixed
  - **Electrician example**: £60/hour, hourly model
  - **Plumber example**: £75/hour or £500/day, mixed model
  - **Plasterer example**: £250/day, day rate model
  - **Decorator example**: £200/day, day rate model
- [ ] Materials markup percentage (e.g., 20-25%)
- [ ] Minimum charge (e.g., 1 hour or £60 minimum)
- [ ] VAT rate (default 20% UK)
- [ ] Time rounding preference (quarter-hour, half-hour, hour)

**2. Payment terms:**
- [ ] Standard payment days (e.g., 7-30 days)
- [ ] Overdue reminder threshold (e.g., 14-45 days)
- [ ] Late payment fees (if applicable)

**3. Job types (trade-specific presets available):**
- [ ] **Electrician**: Consumer Unit, Rewire, Socket Installation, Testing, Fault Finding, EV Charger
- [ ] **Plumber**: Boiler Service, Leak Repair, Bathroom Install, Tap Fitting, Emergency Callout
- [ ] **Plasterer**: Skim Coat, Dry Lining, Artex Removal, Coving, Patch Repair
- [ ] **Heating Engineer**: Boiler Install, Boiler Service, Powerflush, System Upgrade
- [ ] **Builder**: Extension, Loft Conversion, Kitchen Fit, Foundation Work
- [ ] **Gas Engineer**: Gas Safety Check, Boiler Install, Cooker Install, Leak Repair
- [ ] **Roofer**: Tile Replacement, Flat Roof, Chimney Repair, Gutter Cleaning
- [ ] **Decorator**: Interior Painting, Wallpapering, Exterior Painting, Woodwork
- [ ] **Custom**: Add your own specific job types

**4. Industry Certifications (displayed on invoices/quotes):**
- [ ] **Electrician**: NICEIC, NAPIT, ECA, SELECT, Part P
- [ ] **Plumber**: WaterSafe, CIPHE, SNIPEF
- [ ] **Gas Engineer**: Gas Safe Register (essential)
- [ ] **Heating Engineer**: OFTEC, HETAS
- [ ] **Roofer**: CompetentRoofer, NFRC
- [ ] **Custom**: Add your trade-specific certifications

### Step 4: Connector Selection & Setup (Variable time)

**Tenant chooses which connectors to enable:**

**Required Connectors** (tenant must choose one):
- [ ] **Accounting**: Xero, QuickBooks, Sage, or FreeAgent
- [ ] **Calendar**: Google Calendar, Outlook, or Apple Calendar

**Optional Connectors** (tenant can enable/disable):
- [ ] **CRM**: Monday.com, HubSpot, Pipedrive, or Built-in (free)
- [ ] **Messaging**: TimelinesAI, Twilio, or Built-in (manual)
- [ ] **Automation**: Make.com, Zapier, n8n, or Built-in
- [ ] **Video**: Zoom, Google Meet, Teams, or None

**For each enabled connector, customer must provide:**

**Xero** (most common):
- Xero login for OAuth
- Tom assists with app connection
- Test: Create sample invoice

**Monday.com** (if using):
- Monday.com API key
- Board ID for leads/customers
- Test: Sync one contact

**Google Calendar** (most common):
- Google Workspace or Gmail account
- OAuth authorization
- Test: Create test appointment

**TimelinesAI** (if using):
- TimelinesAI API key
- WhatsApp Business number
- Test: Send test message

**Make.com** (if using for invoice automation):
- Make.com account
- Webhook URL
- Email forwarding rules
- Test: Process sample invoice

**Connector Costs (Tenant Pays Directly):**
- Xero: ~£12-25/month
- Monday.com: ~£8-40/user/month
- TimelinesAI: ~£19-79/month
- Make.com: ~£9-29/month
- Google Calendar: Free
- Zoom: Free-£119/month

**Platform Connector Fees (Tom Charges):**
- Using built-in connectors (CRM, Messaging): £0
- Using premium connectors: +£10-20/month per connector (future pricing)

**Tom configures:**
- [ ] Encrypted credential storage for each connector
- [ ] Test connection to each enabled API
- [ ] Configure webhooks/callbacks where needed
- [ ] Set up supplier email monitoring (if Make.com enabled)

### Step 5: Supplier Configuration (5 minutes)

**List suppliers specific to your trade:**

**Electricians typically use:**
- LEW Electrical, CEF, YESSS Electrical, TLC Direct, Screwfix, Toolstation
- NICEIC (for certifications/inspections)

**Plumbers typically use:**
- Plumb Center, City Plumbing, Travis Perkins, Wolseley, Screwfix
- WaterSafe (certifications)

**Plasterers typically use:**
- British Gypsum, Jewson, Travis Perkins, Wickes, Buildbase

**Heating Engineers typically use:**
- Plumb Center, MKM Building Supplies, Wolseley, Parts Center
- OFTEC, Gas Safe (registrations/inspections)

**Builders typically use:**
- Travis Perkins, Jewson, Buildbase, Selco, Wickes, B&Q Trade

**Gas Engineers typically use:**
- Gas Centre, Plumb Center, Parts Center
- Gas Safe Register (essential)

**Configuration per supplier:**
```javascript
suppliers: [
  { 
    name: "Plumb Center", 
    email_domains: ["plumbcenter.co.uk"], 
    invoice_prefix: "PC-" 
  },
  { 
    name: "City Plumbing", 
    email_domains: ["cityplumbing.co.uk"], 
    invoice_prefix: "CP-" 
  }
]
```

System will monitor these suppliers' invoice emails and auto-extract costs.

### Step 6: Test & Handover (30 minutes)
1. Tom logs in as the new tenant
2. Creates test job
3. Uploads test photo
4. Syncs with Xero (test invoice creation)
5. Verifies branding displays correctly
6. Walkthrough with customer (screen share)
7. Customer creates their first real job

### Total Onboarding Time: ~60 minutes per tenant

### Onboarding Checklist Template

**Tenant Name:** _______________  
**Date:** _______________  
**Onboarded by:** Tom / Digital Domain

- [ ] Tenant database record created
- [ ] Subdomain/custom domain configured and SSL active
- [ ] Logo uploaded and displaying correctly
- [ ] Brand colours applied (preview verified)
- [ ] Hourly rate and markup configured
- [ ] Payment terms set
- [ ] Job types customized
- [ ] Xero OAuth completed and tested
- [ ] Google Calendar OAuth completed and tested
- [ ] Monday.com API connected
- [ ] TimelinesAI API connected
- [ ] Supplier list configured
- [ ] Email monitoring active
- [ ] Test job created successfully
- [ ] Test invoice synced to Xero
- [ ] Customer walkthrough completed
- [ ] Support contact details shared
- [ ] Customer has admin access and password

**Notes:**  
_______________________________________________

**Customer Sign-off:** _______________

---

## 18. White-Label Pricing Model (Future SaaS)

**If Tom decides to commercialize this:**

### Pricing Tiers

**Starter Plan - £99/month**
- 1 user
- 100 jobs/month
- 5GB photo storage
- Standard integrations (Xero, Google Calendar)
- Email support (48hr response)

**Professional Plan - £199/month**
- 5 users
- 500 jobs/month
- 25GB photo storage
- All integrations (includes Monday.com, TimelinesAI)
- WhatsApp automation
- Priority email support (24hr response)
- Phone support

**Enterprise Plan - £399/month**
- Unlimited users
- Unlimited jobs
- 100GB photo storage
- All integrations
- Custom domain included
- Dedicated account manager
- 4-hour critical support response
- Custom feature development (quoted separately)

### Special Pricing for Bright Sparks
- **Lifetime discount**: 50% off any tier (founding customer benefit)
- **Current equivalent**: Professional Plan = £99.50/month forever
- **Priority support**: Bright Sparks gets priority for new features

### Revenue Projections (Conservative)
- 10 customers at £150 avg = £1,500/month = £18,000/year
- 50 customers at £150 avg = £7,500/month = £90,000/year
- 100 customers at £150 avg = £15,000/month = £180,000/year

**Tom's costs:**
- Cloudflare Workers: ~£20/month (scales well)
- Database (Turso/D1): ~£50/month for 50 tenants
- R2 Storage: ~£100/month for 50 tenants (2.5TB)
- Support time: Main variable cost

**Net margin:** 70-80% after infrastructure costs (before Tom's time)

---

## Appendices

### Appendix A: Contact Information
- **Business Owner**: Frankie, Bright Sparks of York Ltd
  - Email: frankie@brightsparks-york.com
  - Phone: (to be added)
  
- **Developer**: Tom, Digital Domain Technologies Ltd
  - Email: (to be added)
  - Support hours: (to be confirmed)

### Appendix B: Platform URLs
- Scheduler: (TBD - Cloudflare Workers domain)
- Xero: https://go.xero.com
- Monday.com: https://brightsparks.monday.com (to be confirmed)
- TimelinesAI: https://app.timelines.ai
- Make.com: https://www.make.com/en/login

### Appendix C: Glossary
- **BOM**: Bill of Materials - list of materials used in a job
- **CRM**: Customer Relationship Management
- **OAuth**: Open Authorization - secure authentication standard
- **Two-way sync**: Data changes in either system update the other
- **Webhook**: Automated notification when an event occurs
- **R2**: Cloudflare's object storage service (like AWS S3)

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Frankie | Initial draft |
| 2.0 | Dec 2024 | Claude | Enhanced with risk mitigation, acceptance criteria, detailed workflows |

**Approval**

- [ ] Frankie (Business Owner) - Approved
- [ ] Tom (Developer) - Reviewed and feasible

**Next Steps**
1. Tom reviews PRD and confirms technical feasibility
2. Phase 0 API validation (3 days)
3. Kickoff meeting to confirm timeline and priorities
4. Begin Phase 1 development
