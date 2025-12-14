# Universal Service Provider Management System - Implementation Plan

## Executive Summary

Build a **truly universal service provider platform** from scratch supporting both physical contractors (electricians, plumbers, builders) AND service professionals (software developers, architects, web designers).

**Core Principle**: Everything is optional and configurable per tenant through simple markdown templates and feature toggles.

**Development Context**:
- ✅ Greenfield project (no existing system to migrate)
- ✅ No breaking changes or migrations
- ✅ Tom-only admin (simple onboarding workflow)
- ✅ Fixed optional fields initially (no custom field builder)
- ✅ Template-based workflows (markdown definitions)
- ✅ Priority: Physical contractors first, then software architects

---

## Plan Summary (Quick Reference)

**What**: Build universal service provider management system from scratch

**Who**: Physical contractors (electricians, plumbers) + Service professionals (software developers, architects)

**How**: Template-based configuration with feature toggles (no complex admin UI initially)

**When**: 8 weeks (2 months)

**Key Simplifications**:
- ✅ Tom-only admin (command-line onboarding script, not web UI)
- ✅ Fixed optional fields (github_repo, deployment_url, etc. - no custom field builder)
- ✅ Markdown workflow templates (not drag-and-drop visual builder)
- ✅ JSON configuration templates (6 pre-built industry templates)
- ✅ Greenfield project (no migrations, no breaking changes)

**Critical Architecture**:
- Multi-tenant database with tenant_id on ALL queries
- Module toggles (photos, suppliers, materials, location, certifications)
- Configurable pricing models (hourly, day rate, fixed price, appointment, retainer)
- Workflow templates in markdown (electrical-contractor.md, software-developer.md, etc.)

**Success Metrics**:
- 10 test tenants from different industries operational
- Tom can onboard new tenant in <5 minutes using template
- Zero hardcoded trade-specific logic
- Page load <2 seconds

---

## Current State Analysis

### Hard-Coded Assumptions (Lines from plan.md)
1. **Photos mandatory** (lines 513-517) - "Before photos required to start job timer"
2. **Supplier tracking** (lines 533-562) - Email monitoring, invoice extraction assumed
3. **Materials tracking** (line 508-509) - BOM and 20% markup hardcoded
4. **GPS/Location** (lines 528, 641, 804) - Travel time, geospatial analysis
5. **Fixed workflow** (lines 526-531) - Scheduled → On Route → In Progress → Completed → Invoiced
6. **Hourly + materials pricing** (lines 109-123) - Only one billing model
7. **Industry certifications** (lines 102-105, 1603-1608) - Trade-specific hardcoded

### Service Provider Requirements Comparison

| Feature | Electrician | Software Dev | Architect | Web Designer | Hairdresser | Dog Walker |
|---------|------------|--------------|-----------|--------------|-------------|------------|
| Photos | Mandatory | No | No | Mockups | Portfolio | Optional |
| Suppliers | Yes | No | No | Hosting | Products | No |
| Materials | Yes | No | No | No | Products | No |
| Location | On-site | Remote | Office/Remote | Remote | Salon | Route |
| Billing | Hourly+Materials | Hourly/Project | Project | Hourly/Project | Appointment | Appointment |
| Certs | NICEIC, Part P | None | License | Portfolio | License | None |

**Key Insight**: Only 30% of service types need photos, suppliers, or materials tracking.

---

## Architecture Changes Required

### 1. Module-Based Feature System

**Current**: All features always enabled
**New**: Modules can be enabled/disabled per tenant

```javascript
tenant.modules = {
  // Core (always enabled)
  scheduling: { enabled: true },
  customers: { enabled: true },
  invoicing: { enabled: true },

  // Optional modules
  photos: {
    enabled: true,
    mandatory_before: false,  // Can toggle
    mandatory_after: false,
    storage: 'r2',
    compression: true
  },

  suppliers: {
    enabled: false,  // Software dev doesn't need this
    email_monitoring: false,
    invoice_extraction: false
  },

  materials: {
    enabled: false,
    markup_percentage: null,
    track_costs: false
  },

  location: {
    enabled: false,
    gps_tracking: false,
    travel_time: false,
    geospatial_analytics: false
  },

  certifications: {
    enabled: false,
    list: [],  // Empty for non-certified trades
    display_on_invoice: false
  }
};
```

### 2. Flexible Pricing Models

**Current**: Hourly rate + materials markup only (line 109-123)
**New**: Multiple pricing models per tenant

```javascript
tenant.pricing = {
  model: 'hourly' | 'day_rate' | 'fixed_price' | 'appointment' | 'retainer' | 'hybrid',

  // Hourly model (electricians, developers)
  hourly_rate: 60.00,
  minimum_charge_hours: 1.0,
  time_rounding: 'half_hour',

  // Day rate model (plasterers, decorators)
  day_rate: 250.00,

  // Fixed price model (architects, web designers)
  default_fixed_price: null,  // Set per job

  // Appointment model (hairdressers, dog walkers)
  appointment_fee: 45.00,

  // Retainer model (therapists, consultants)
  retainer_monthly: 1500.00,
  retainer_hours_included: 10,

  // Materials (optional)
  track_materials: false,  // Disabled for service providers
  materials_markup: null,

  // VAT
  vat_rate: 0.20,
  vat_registered: true
};
```

### 3. Custom Workflow Builder

**Current**: Fixed 5-stage workflow (line 526-531)
**New**: Configurable workflow per tenant

```javascript
tenant.workflow = {
  stages: [
    { id: 'open', name: 'Open', color: '#gray' },
    { id: 'development', name: 'In Development', color: '#blue' },
    { id: 'review', name: 'Code Review', color: '#orange' },
    { id: 'deployed', name: 'Deployed', color: '#green' },
    { id: 'invoiced', name: 'Invoiced', color: '#purple' }
  ],

  // Example for electrician:
  // stages: ['Scheduled', 'On Route', 'In Progress', 'Completed', 'Invoiced']

  // Example for dog walker:
  // stages: ['Scheduled', 'In Progress', 'Completed', 'Invoiced']

  // Example for therapist:
  // stages: ['Scheduled', 'In Session', 'Completed', 'Invoiced']

  allow_skip_stages: true,  // Can skip "On Route" for remote work
  final_stage_required: true  // Must reach "Invoiced" or "Completed"
};
```

### 4. Custom Fields System

**New**: Tenants can add unlimited custom fields

```javascript
tenant.custom_fields = [
  {
    id: 'cf_1',
    name: 'GitHub Repository',
    type: 'url',
    applies_to: 'job',  // job, customer, invoice
    required: true,
    visible_in_list: true,
    position: 5,
    help_text: 'Link to GitHub repo for this project'
  },
  {
    id: 'cf_2',
    name: 'Deployment URL',
    type: 'url',
    applies_to: 'job',
    required: false,
    visible_in_list: true,
    position: 6
  },
  {
    id: 'cf_3',
    name: 'Test Coverage',
    type: 'percentage',
    applies_to: 'job',
    required: false,
    visible_in_list: false,
    position: 7
  }
];
```

### 5. Field Visibility & Requirements

**New**: Control which built-in fields are visible/required

```javascript
tenant.field_config = {
  job: {
    customer: { visible: true, required: true },
    job_type: { visible: true, required: true },
    scheduled_date: { visible: true, required: true },
    estimated_duration: { visible: true, required: true },
    location: { visible: false, required: false },  // Hidden for remote work
    gps_coordinates: { visible: false, required: false },
    before_photos: { visible: false, required: false },  // Disabled for devs
    after_photos: { visible: false, required: false },
    materials_list: { visible: false, required: false },  // Disabled
    order_reference: { visible: false, required: false }
  },

  customer: {
    name: { visible: true, required: true },
    email: { visible: true, required: true },
    phone: { visible: true, required: true },
    address: { visible: true, required: false },  // Optional for remote
    postcode: { visible: true, required: false }
  },

  invoice: {
    labour_cost: { visible: true, required: true },
    materials_cost: { visible: false, required: false },  // Hidden
    markup: { visible: false, required: false },
    vat: { visible: true, required: true },
    payment_terms: { visible: true, required: true }
  }
};
```

---

## Admin UI Design

### Settings → Module Management

```
┌─────────────────────────────────────────────────┐
│ Module Management                                │
├─────────────────────────────────────────────────┤
│                                                  │
│ ☑ Core Modules (Always Enabled)                 │
│   • Scheduling & Calendar                        │
│   • Customer Management                          │
│   • Invoicing                                    │
│   • Reporting                                    │
│                                                  │
│ ☐ Optional Modules                              │
│                                                  │
│ ┌─ Photo Management ──────────────────────┐    │
│ │ Enable photos: [✓ Enabled]              │    │
│ │ Before photos mandatory: [ ] Optional    │    │
│ │ After photos mandatory: [ ] Optional     │    │
│ │ Storage provider: [R2 ▼]                │    │
│ │ Compression: [✓ Enabled]                 │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ ┌─ Supplier Management ────────────────────┐    │
│ │ Enable suppliers: [ ] Disabled           │    │
│ │ Email monitoring: [ ] Disabled           │    │
│ │ Invoice extraction: [ ] Disabled         │    │
│ │ Configured suppliers: 0                  │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ ┌─ Materials Tracking ──────────────────────┐   │
│ │ Track materials: [ ] Disabled            │   │
│ │ Apply markup: [ ] Disabled               │   │
│ │ Markup percentage: [    ]%               │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌─ Location Services ───────────────────────┐   │
│ │ Enable location: [ ] Disabled            │   │
│ │ GPS tracking: [ ] Disabled               │   │
│ │ Travel time calc: [ ] Disabled           │   │
│ │ Postcode analytics: [ ] Disabled         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│ ┌─ Industry Certifications ─────────────────┐   │
│ │ Enable certifications: [ ] Disabled      │   │
│ │ Certifications: [None configured]        │   │
│ │ Display on invoice: [ ] Disabled         │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
│         [Save Changes]  [Reset to Defaults]      │
└─────────────────────────────────────────────────┘
```

### Settings → Field Configuration

```
┌─────────────────────────────────────────────────┐
│ Field Configuration - Job Fields                 │
├─────────────────────────────────────────────────┤
│                                                  │
│ Built-in Fields:                                 │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ Field Name          Visible  Required  Pos │  │
│ ├────────────────────────────────────────────┤  │
│ │ Customer Name       [✓]      [✓]        1  │  │
│ │ Job Type            [✓]      [✓]        2  │  │
│ │ Scheduled Date      [✓]      [✓]        3  │  │
│ │ Estimated Duration  [✓]      [✓]        4  │  │
│ │ Location/Address    [ ]      [ ]        5  │  │
│ │ GPS Coordinates     [ ]      [ ]        6  │  │
│ │ Before Photos       [ ]      [ ]        7  │  │
│ │ After Photos        [ ]      [ ]        8  │  │
│ │ Materials List      [ ]      [ ]        9  │  │
│ │ Order Reference     [ ]      [ ]       10  │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Custom Fields:                                   │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ GitHub Repository   [✓]      [✓]       11  │  │
│ │ Deployment URL      [✓]      [ ]       12  │  │
│ │ Test Coverage       [✓]      [ ]       13  │  │
│ │                                            │  │
│ │         [+ Add Custom Field]               │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│              [Save]  [Preview Form]              │
└─────────────────────────────────────────────────┘
```

### Settings → Workflow Builder

```
┌─────────────────────────────────────────────────┐
│ Custom Workflow Builder                          │
├─────────────────────────────────────────────────┤
│                                                  │
│ Current Workflow (Software Development):         │
│                                                  │
│  ┌──────┐   ┌─────────────┐   ┌───────────┐   │
│  │ Open │──▶│ Development │──▶│   Review  │   │
│  └──────┘   └─────────────┘   └───────────┘   │
│       ↓                              ↓          │
│  ┌──────────┐                  ┌─────────────┐ │
│  │ Deployed │◀─────────────────│  Invoiced   │ │
│  └──────────┘                  └─────────────┘ │
│                                                  │
│ Stage Details:                                   │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ Stage 1: Open                              │  │
│ │ Color: [Gray ▼]                           │  │
│ │ Icon: [📋 ▼]                              │  │
│ │ Next stages: [Development ▼]              │  │
│ │ Can skip: [ ]                              │  │
│ │ Notifications: [✓ Email] [✓ WhatsApp]    │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ [+ Add Stage]  [⌫ Delete]  [↑↓ Reorder]         │
│                                                  │
│ Presets:                                         │
│ • Electrician Workflow                           │
│ • Software Developer Workflow (Current)          │
│ • Consultant Workflow                            │
│ • Service Provider Workflow                      │
│                                                  │
│              [Save Workflow]  [Reset]            │
└─────────────────────────────────────────────────┘
```

### Settings → Pricing Configuration

```
┌─────────────────────────────────────────────────┐
│ Pricing Configuration                            │
├─────────────────────────────────────────────────┤
│                                                  │
│ Primary Billing Model:                           │
│ ● Hourly Rate                                    │
│ ○ Day Rate                                       │
│ ○ Fixed Price (per project)                     │
│ ○ Appointment-based                              │
│ ○ Retainer                                       │
│ ○ Hybrid (multiple models)                       │
│                                                  │
│ Hourly Rate Settings:                            │
│ ┌────────────────────────────────────────────┐  │
│ │ Standard rate: [£ 150.00] per hour        │  │
│ │ Minimum charge: [1.0] hours               │  │
│ │ Time rounding: [Half hour ▼]             │  │
│ │                                            │  │
│ │ Track time by operator: [✓]               │  │
│ │                                            │  │
│ │ Overtime rate (optional):                 │  │
│ │   Evening/weekend: [£ 180.00] per hour    │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Materials & Expenses:                            │
│ ┌────────────────────────────────────────────┐  │
│ │ Track materials: [ ] Disabled             │  │
│ │ Apply markup: [ ] Disabled                │  │
│ │                                            │  │
│ │ Track expenses: [✓] Enabled               │  │
│ │   Hosting costs: [✓]                      │  │
│ │   Software licenses: [✓]                  │  │
│ │   Cloud services: [✓]                     │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Tax Settings:                                    │
│ ┌────────────────────────────────────────────┐  │
│ │ VAT registered: [✓]                       │  │
│ │ VAT rate: [20]%                           │  │
│ │ Display VAT on quotes: [✓]                │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Payment Terms:                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ Standard payment days: [14] days          │  │
│ │ Overdue reminder: [30] days               │  │
│ │ Late payment fee: [£ 0.00]                │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│                    [Save Configuration]          │
└─────────────────────────────────────────────────┘
```

---

## Database Schema Changes

### New Tables

```sql
-- Tenant module configuration
CREATE TABLE tenant_modules (
  tenant_id VARCHAR(255) NOT NULL,
  module_name VARCHAR(50) NOT NULL,  -- 'photos', 'suppliers', 'materials', 'location', 'certifications'
  enabled BOOLEAN DEFAULT false,
  config JSON,  -- Module-specific settings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, module_name)
);

-- Custom fields per tenant
CREATE TABLE tenant_custom_fields (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,
  field_name VARCHAR(100) NOT NULL,
  field_type VARCHAR(20) NOT NULL,  -- 'text', 'url', 'number', 'date', 'dropdown', 'percentage'
  applies_to VARCHAR(20) NOT NULL,  -- 'job', 'customer', 'invoice'
  is_required BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  position INTEGER NOT NULL,
  help_text TEXT,
  dropdown_options JSON,  -- For dropdown type
  validation_rules JSON,  -- Min/max for numbers, regex for text, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom field values
CREATE TABLE custom_field_values (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,
  field_id VARCHAR(36) NOT NULL,  -- References tenant_custom_fields.id
  record_type VARCHAR(20) NOT NULL,  -- 'job', 'customer', 'invoice'
  record_id VARCHAR(36) NOT NULL,
  field_value TEXT,  -- Stores all types as text, parse based on field_type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES tenant_custom_fields(id)
);

-- Field configuration (visibility/requirements for built-in fields)
CREATE TABLE tenant_field_config (
  tenant_id VARCHAR(255) NOT NULL,
  field_group VARCHAR(20) NOT NULL,  -- 'job', 'customer', 'invoice'
  field_name VARCHAR(100) NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT false,
  position INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, field_group, field_name)
);

-- Custom workflows
CREATE TABLE tenant_workflows (
  tenant_id VARCHAR(255) NOT NULL,
  stage_id VARCHAR(50) NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  stage_color VARCHAR(7),  -- Hex color code
  stage_icon VARCHAR(10),  -- Emoji or icon name
  position INTEGER NOT NULL,
  can_skip_to JSON,  -- Array of stage_ids that can be reached from this stage
  notifications JSON,  -- Email, WhatsApp settings per stage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tenant_id, stage_id)
);
```

### Modified Tables

```sql
-- Add to existing tenant config table
ALTER TABLE tenants ADD COLUMN pricing_model VARCHAR(20) DEFAULT 'hourly';
ALTER TABLE tenants ADD COLUMN hourly_rate DECIMAL(10,2);
ALTER TABLE tenants ADD COLUMN day_rate DECIMAL(10,2);
ALTER TABLE tenants ADD COLUMN appointment_fee DECIMAL(10,2);
ALTER TABLE tenants ADD COLUMN retainer_monthly DECIMAL(10,2);
ALTER TABLE tenants ADD COLUMN retainer_hours_included INTEGER;
ALTER TABLE tenants ADD COLUMN track_materials BOOLEAN DEFAULT true;
ALTER TABLE tenants ADD COLUMN materials_markup DECIMAL(5,2);
ALTER TABLE tenants ADD COLUMN time_rounding VARCHAR(20) DEFAULT 'half_hour';
```

---

## Simplified Implementation Phases

### Phase 1: Core Multi-Tenant Foundation (Week 1-3)

**Goal**: Build configurable tenant system from scratch with feature toggles

**Key Decisions (Simplified)**:
- ✅ No custom field builder - use fixed optional fields instead
- ✅ No drag-and-drop workflow builder - use markdown template selection
- ✅ Tom-only admin during onboarding (no tenant self-service UI)
- ✅ Focus on physical contractors first, software architects second

**Tasks**:

1. **Database Schema** (Simple multi-tenant structure)
```sql
-- Core tenant table with embedded config (JSON)
CREATE TABLE tenants (
  tenant_id VARCHAR(255) PRIMARY KEY,
  domain VARCHAR(255) UNIQUE,
  company_name VARCHAR(255),
  trade VARCHAR(50),  -- 'electrical', 'plumbing', 'software', 'architecture'

  -- Branding (JSON)
  branding JSON,  -- { logo_url, primary_color, secondary_color }

  -- Module toggles (simple booleans)
  enable_photos BOOLEAN DEFAULT true,
  enable_suppliers BOOLEAN DEFAULT true,
  enable_materials BOOLEAN DEFAULT true,
  enable_location BOOLEAN DEFAULT true,
  enable_certifications BOOLEAN DEFAULT true,

  -- Pricing model
  pricing_model VARCHAR(20) DEFAULT 'hourly',
  hourly_rate DECIMAL(10,2),
  materials_markup DECIMAL(5,2),

  -- Optional fields toggle (JSON array)
  enabled_fields JSON,  -- ['github_repo', 'deployment_url', 'test_coverage']

  -- Workflow template name
  workflow_template VARCHAR(50) DEFAULT 'standard',

  -- Connector configs (encrypted JSON)
  connectors JSON,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table (tenant-scoped)
CREATE TABLE jobs (
  job_id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,
  customer_id VARCHAR(36),
  job_type VARCHAR(100),
  status VARCHAR(50),
  scheduled_date TIMESTAMP,

  -- Optional fields (NULL if not used)
  location VARCHAR(255),
  gps_coordinates VARCHAR(50),
  github_repo VARCHAR(255),
  deployment_url VARCHAR(255),
  test_coverage DECIMAL(5,2),

  -- Financial
  labour_hours DECIMAL(10,2),
  labour_cost DECIMAL(10,2),
  materials_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),

  created_at TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
);
```

2. **Workflow Templates** (Markdown definitions in `/config/workflows/`)
```markdown
<!-- /config/workflows/electrical-contractor.md -->
# Electrical Contractor Workflow

## Stages
1. Scheduled (gray, 📋)
2. On Route (blue, 🚗)
3. In Progress (orange, ⚡)
4. Completed (green, ✅)
5. Invoiced (purple, 💰)

## Transitions
- Any stage can move to next stage
- Can skip "On Route" for local jobs
- Cannot skip "Completed" before "Invoiced"

## Notifications
- Scheduled → WhatsApp confirmation
- On Route → WhatsApp "on the way"
- Completed → Share photos
- Invoiced → Email invoice
```

```markdown
<!-- /config/workflows/software-developer.md -->
# Software Developer Workflow

## Stages
1. Open (gray, 📋)
2. In Development (blue, 💻)
3. Code Review (orange, 👀)
4. Deployed (green, 🚀)
5. Invoiced (purple, 💰)

## Transitions
- Linear progression
- Can skip "Code Review" for small fixes
- "Deployed" required before "Invoiced"

## Notifications
- Open → Email confirmation
- Deployed → Email with deployment URL
- Invoiced → Email invoice
```

3. **Tenant Configuration Service** (`/src/services/tenant-config.js`)
```javascript
// Simple tenant config loader
export async function getTenantConfig(tenantId) {
  const tenant = await db.tenants.findById(tenantId);

  return {
    id: tenant.tenant_id,
    trade: tenant.trade,

    // Module flags
    modules: {
      photos: tenant.enable_photos,
      suppliers: tenant.enable_suppliers,
      materials: tenant.enable_materials,
      location: tenant.enable_location,
      certifications: tenant.enable_certifications
    },

    // Pricing
    pricing: {
      model: tenant.pricing_model,
      hourly_rate: tenant.hourly_rate,
      materials_markup: tenant.materials_markup
    },

    // Workflow
    workflow: await loadWorkflowTemplate(tenant.workflow_template),

    // Optional fields
    optionalFields: JSON.parse(tenant.enabled_fields || '[]'),

    // Branding
    branding: JSON.parse(tenant.branding)
  };
}
```

4. **Tom's Onboarding Script** (Command-line tool)
```bash
# /scripts/onboard-tenant.sh
# Tom runs this when onboarding new client

./onboard-tenant.sh \
  --tenant-id="brightsparks-york" \
  --trade="electrical" \
  --company="Bright Sparks of York Ltd" \
  --domain="brightsparks-york.com" \
  --hourly-rate=60 \
  --materials-markup=0.20 \
  --workflow="electrical-contractor" \
  --enable-all

# For software dev:
./onboard-tenant.sh \
  --tenant-id="devflow-software" \
  --trade="software" \
  --company="DevFlow Software Ltd" \
  --hourly-rate=150 \
  --workflow="software-developer" \
  --disable-photos \
  --disable-suppliers \
  --disable-materials \
  --optional-fields="github_repo,deployment_url,test_coverage"
```

**Acceptance Criteria**:
- [ ] Tenant config table created
- [ ] 5 workflow templates created (markdown files)
- [ ] Tenant config service loads config correctly
- [ ] Onboarding script creates tenant in <2 minutes
- [ ] Test with 2 tenants: Bright Sparks + DevFlow

---

### Phase 2: Dynamic UI Rendering (Week 4-5)

**Goal**: Forms adapt based on tenant configuration

**Tasks**:

1. **Dynamic Form Component** (`/src/components/DynamicForm.jsx`)
```javascript
// Forms check tenant config and hide/show fields
export function JobForm({ tenantConfig }) {
  const showPhotos = tenantConfig.modules.photos;
  const showLocation = tenantConfig.modules.location;
  const showMaterials = tenantConfig.modules.materials;

  return (
    <form>
      {/* Always show */}
      <Input name="customer" required />
      <Input name="job_type" required />
      <Input name="scheduled_date" required />

      {/* Conditional based on tenant */}
      {showLocation && <Input name="location" />}
      {showLocation && <Input name="gps_coordinates" />}

      {showPhotos && <FileUpload name="before_photos" />}
      {showPhotos && <FileUpload name="after_photos" />}

      {showMaterials && <MaterialsList />}

      {/* Optional fields for this tenant */}
      {tenantConfig.optionalFields.includes('github_repo') && (
        <Input name="github_repo" type="url" label="GitHub Repository" />
      )}

      {tenantConfig.optionalFields.includes('deployment_url') && (
        <Input name="deployment_url" type="url" label="Deployment URL" />
      )}
    </form>
  );
}
```

2. **Workflow Status Component** (`/src/components/WorkflowStatus.jsx`)
```javascript
// Status dropdown uses tenant's workflow template
export function WorkflowStatusDropdown({ tenantConfig, currentStatus }) {
  const stages = tenantConfig.workflow.stages;

  return (
    <select value={currentStatus}>
      {stages.map(stage => (
        <option key={stage.id} value={stage.id}>
          {stage.icon} {stage.name}
        </option>
      ))}
    </select>
  );
}
```

3. **Invoice Calculator** (`/src/services/invoice-calculator.js`)
```javascript
// Invoice calculation adapts to pricing model
export function calculateInvoice(job, tenantConfig) {
  let subtotal = 0;

  // Labour calculation
  if (tenantConfig.pricing.model === 'hourly') {
    subtotal += job.labour_hours * tenantConfig.pricing.hourly_rate;
  } else if (tenantConfig.pricing.model === 'fixed_price') {
    subtotal = job.fixed_price;
  }

  // Materials (only if enabled)
  if (tenantConfig.modules.materials && job.materials_cost) {
    const markup = tenantConfig.pricing.materials_markup || 0;
    subtotal += job.materials_cost * (1 + markup);
  }

  // VAT
  const vat = subtotal * 0.20;
  const total = subtotal + vat;

  return { subtotal, vat, total };
}
```

**Acceptance Criteria**:
- [ ] Job form hides fields based on tenant config
- [ ] Workflow dropdown shows correct stages
- [ ] Invoice calculator uses correct pricing model
- [ ] Bright Sparks sees all fields (electrician)
- [ ] DevFlow sees only relevant fields (software dev)

---

### Phase 3: Onboarding Templates (Week 6)

**Goal**: Pre-configured templates for quick tenant creation

**Tasks**:

1. **Template Directory** (`/config/templates/`)
```javascript
// /config/templates/electrical-contractor.json
{
  "name": "Electrical Contractor",
  "description": "For electricians, HVAC, plumbers with materials and on-site work",
  "icon": "⚡",
  "config": {
    "trade": "electrical",
    "pricing_model": "hourly",
    "hourly_rate": 60,
    "materials_markup": 0.20,
    "enable_photos": true,
    "enable_suppliers": true,
    "enable_materials": true,
    "enable_location": true,
    "enable_certifications": true,
    "workflow_template": "electrical-contractor",
    "enabled_fields": [],
    "job_types": [
      "Consumer Unit Replacement",
      "Rewire",
      "Socket Installation",
      "Testing & Inspection",
      "Fault Finding",
      "EV Charger Installation"
    ]
  }
}

// /config/templates/software-developer.json
{
  "name": "Software Developer",
  "description": "For software developers, architects, engineers (remote work)",
  "icon": "💻",
  "config": {
    "trade": "software",
    "pricing_model": "hourly",
    "hourly_rate": 150,
    "materials_markup": 0,
    "enable_photos": false,
    "enable_suppliers": false,
    "enable_materials": false,
    "enable_location": false,
    "enable_certifications": false,
    "workflow_template": "software-developer",
    "enabled_fields": ["github_repo", "deployment_url", "test_coverage"],
    "job_types": [
      "Feature Development",
      "Bug Fix",
      "Code Review",
      "Refactoring",
      "Consultation",
      "Architecture Design"
    ]
  }
}
```

2. **Updated Onboarding Script**
```bash
# Tom selects template during onboarding
./onboard-tenant.sh \
  --template="electrical-contractor" \
  --tenant-id="brightsparks-york" \
  --company="Bright Sparks of York Ltd" \
  --domain="brightsparks-york.com"

# OR for software dev:
./onboard-tenant.sh \
  --template="software-developer" \
  --tenant-id="codeflow-architects" \
  --company="CodeFlow Architects" \
  --hourly-rate=200  # Override template default
```

3. **Additional Templates**
- Plumber template (like electrician but different job types)
- Builder template (day rate pricing model)
- Architect template (project-based pricing)
- Web designer template (hourly + hosting expenses)

**Acceptance Criteria**:
- [ ] 6 templates created (JSON files)
- [ ] Onboarding script accepts --template parameter
- [ ] Template values can be overridden during onboarding
- [ ] Tom can onboard new tenant in <5 minutes using template
- [ ] Test onboarding with all 6 templates

---

### Phase 4: Polish & Testing (Week 7-8)

**Goal**: Production-ready system with complete testing

**Tasks**:

1. **Create 10 Test Tenants** (Diverse industries)
   - Bright Sparks (electrician) ✓
   - DevFlow (software dev) ✓
   - PerfectPlaster (plasterer - day rate)
   - QuickCuts Salon (hairdresser - appointment-based)
   - WalkiesExpress (dog walker - appointment)
   - BuildRight (builder - day rate)
   - DesignStudio (architect - project-based)
   - WebCraft (web designer - hourly)
   - FixitPlumbing (plumber - hourly + materials)
   - ConsultPro (consultant - retainer)

2. **End-to-End Testing** (Each tenant type)
   - Create job
   - Upload photos (if enabled)
   - Track materials (if enabled)
   - Update status through workflow
   - Generate invoice
   - Verify calculations correct

3. **Performance Testing**
   - 100 tenants with 1000 jobs each
   - Query performance with tenant isolation
   - Page load <2 seconds

4. **Documentation for Tom**
   - Onboarding checklist (template selection, customization)
   - Troubleshooting guide
   - Workflow template editing guide
   - Optional fields reference

**Acceptance Criteria**:
- [ ] 10 diverse test tenants operational
- [ ] All tenant types tested end-to-end
- [ ] Performance targets met
- [ ] Tom can onboard new tenant without assistance
- [ ] Complete documentation written

---

## Critical Files to Modify

### Configuration Logic
1. `src/config/tenant-config.js` - Tenant configuration loader (NEW)
2. `src/services/pricing-service.js` - Pricing calculation logic (REFACTOR)
3. `src/services/workflow-service.js` - Workflow stage management (NEW)
4. `src/services/field-service.js` - Dynamic field rendering (NEW)

### UI Components
1. `src/components/admin/ModuleManager.jsx` - Module enable/disable (NEW)
2. `src/components/admin/FieldConfigurator.jsx` - Field visibility (NEW)
3. `src/components/admin/WorkflowBuilder.jsx` - Workflow stages (NEW)
4. `src/components/admin/PricingConfig.jsx` - Pricing models (NEW)
5. `src/components/admin/CustomFieldBuilder.jsx` - Custom fields (NEW)

### Form Components
1. `src/components/jobs/JobForm.jsx` - Dynamic form based on config (REFACTOR)
2. `src/components/customers/CustomerForm.jsx` - Dynamic form (REFACTOR)
3. `src/components/invoices/InvoiceForm.jsx` - Dynamic form (REFACTOR)

### Backend
1. `cloudflare/workers/tenant-config.js` - Load tenant config from DB (NEW)
2. `cloudflare/workers/admin-api.js` - Admin settings CRUD (NEW)
3. `database/migrations/` - All new tables (NEW)

---

## Success Metrics

### Phase 1 (Foundation - Week 1-3)
- [ ] Zero hardcoded business logic in codebase
- [ ] Tenant config system operational
- [ ] 5 workflow templates created (markdown)
- [ ] Command-line onboarding script working
- [ ] Two test tenants: Bright Sparks + DevFlow (end-to-end tested)

### Phase 2 (Dynamic UI - Week 4-5)
- [ ] Forms adapt to tenant config (show/hide fields)
- [ ] Workflow dropdown uses tenant-specific stages
- [ ] Invoice calculator uses correct pricing model
- [ ] Both tenants work with appropriate UI

### Phase 3 (Templates - Week 6)
- [ ] 6 onboarding templates created (JSON)
- [ ] Template-based onboarding working
- [ ] Tom can onboard tenant in <5 minutes
- [ ] All 6 templates tested

### Phase 4 (Polish - Week 7-8)
- [ ] 10 test tenants operational
- [ ] End-to-end testing complete
- [ ] Performance targets met
- [ ] Documentation complete for Tom

### Launch Criteria
- [ ] 10 test tenants from different industries working
- [ ] Tom confident onboarding without assistance
- [ ] Page load <2 seconds
- [ ] Onboarding time <5 minutes per tenant
- [ ] Zero hardcoded trade-specific logic

---

## Risks & Mitigations (Simplified)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Tenant data leakage** | **Critical** | **Low** | **Row-level security in DB, tenant_id filter on ALL queries, automated testing** |
| **Workflow template parsing fails** | **High** | **Low** | **Markdown validation, fallback to default workflow, clear error messages** |
| **Onboarding script errors** | **High** | **Low** | **Dry-run mode, database transaction rollback, comprehensive validation** |
| Module toggle breaks UI | Medium | Low | Defensive coding (check field exists before render), extensive testing |
| Template config invalid JSON | Medium | Low | JSON schema validation before save, template testing script |
| Performance with many tenants | Medium | Low | Database indexing on tenant_id, query optimization, caching layer |
| Tom unavailable for onboarding | Medium | Low | Comprehensive docs, video walkthrough, simple command-line tool |
| Markdown syntax errors in workflows | Low | Medium | Validation script, template examples, documentation |

**Key Risk: Tenant Isolation**
- EVERY database query MUST filter by tenant_id
- Automated tests verify no cross-tenant data access
- Code review checklist enforces tenant isolation

---

## Timeline & Effort

**Total Duration**: 8 weeks (2 months)

| Phase | Duration | Effort | Key Deliverables |
|-------|----------|--------|------------------|
| **Phase 1: Foundation** | 3 weeks | High | Tenant config system, workflow templates, onboarding script |
| **Phase 2: Dynamic UI** | 2 weeks | Medium | Conditional form rendering, workflow dropdown, invoice calculator |
| **Phase 3: Templates** | 1 week | Low | 6 industry templates, template-based onboarding |
| **Phase 4: Polish** | 2 weeks | Medium | 10 test tenants, documentation, performance testing |

**Assumptions**:
- Tom working full-time on project
- No major blockers or scope changes
- Database technology chosen (e.g., PostgreSQL + Cloudflare Workers)

---

## Post-Launch Expansion

### Phase 5 (Future): Self-Service Admin UI
**When**: After 10+ paying customers (validate market first)

**What**:
- Web-based tenant admin (replace command-line tool)
- Module toggle interface
- Workflow template editor (visual or markdown)
- Branding customization UI
- Connector configuration wizard

**Why wait**:
- Validate product-market fit first
- Tom onboarding ensures quality control early
- Self-service adds complexity (authentication, authorization, UI)
- Can charge premium for self-service ($50/month extra)

### Phase 6 (Future): Custom Field Builder
**When**: After 50+ customers request it

**What**:
- Visual field builder (drag-and-drop)
- Custom field types (text, number, date, etc.)
- Field validation rules
- Position/reorder fields

**Why wait**:
- Fixed optional fields sufficient for most use cases
- Custom fields add significant complexity
- Can charge enterprise tier ($100/month extra)

---

## SaaS Business Model (Simplified)

### Pricing Tiers

**Starter** - £99/month
- 1 user, 100 jobs/month
- All core features (scheduling, invoicing, CRM)
- Standard connectors (Xero, Google Calendar)
- 5GB storage

**Professional** - £199/month (Bright Sparks tier)
- 5 users, 500 jobs/month
- All features + premium connectors
- 25GB storage
- WhatsApp automation

**Enterprise** - £399/month
- Unlimited users/jobs
- Custom domain, priority support
- 100GB storage
- Custom feature requests

### Revenue Projections

**Conservative (Year 1)**:
- 50 customers @ £150 avg = £7,500/month = **£90,000/year**

**Realistic (Year 2)**:
- 200 customers @ £150 avg = £30,000/month = **£360,000/year**

**Optimistic (Year 3)**:
- 1,000 customers @ £150 avg = £150,000/month = **£1.8M/year**

### Market Opportunity

**UK Service Businesses**: 910,000+ across all trades
- Electricians: 250,000
- Plumbers: 150,000
- Builders: 200,000
- Software consultants: 80,000
- Others: 230,000

**Target**: 0.1% market share = 910 customers = £136,500/month = £1.64M/year

---

## Next Steps

### Immediate Actions (This Week)
1. ✅ **Review plan** with Tom (technical feasibility)
2. ✅ **Confirm database choice** (PostgreSQL, MySQL, or Turso)
3. ✅ **Set up project structure** (repo, environments)
4. ✅ **Create Phase 1 task breakdown** (detailed sprint planning)

### Week 1 Priorities
1. Database schema implementation
2. Tenant config service (loading/parsing)
3. First workflow template (electrical-contractor.md)
4. Basic onboarding script (command-line)
5. Test tenant creation: Bright Sparks

### Bright Sparks Involvement
- **Week 1**: Provide business requirements (job types, pricing, workflow stages)
- **Week 3**: Review tenant config and test job creation
- **Week 5**: UAT with real data (5-10 jobs)
- **Week 7**: Full production deployment

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-14 | Claude | Initial plan - Universal service provider architecture |
| 2.0 | 2024-12-14 | Claude | Simplified - Greenfield, Tom-only admin, template-based workflows |

**Approval Required**:
- [ ] Tom (Developer) - Technical feasibility review
- [ ] Frankie (Business Owner) - No impact on current operations
- [ ] User (Requestor) - Meets requirements for all service types
