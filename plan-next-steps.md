# Implementation Next Steps

## Immediate Actions (This Week)

### 1. Technical Setup
- [ ] **Choose database technology**
  - PostgreSQL (recommended - mature, JSON support)
  - MySQL (alternative)
  - Turso (SQLite for edge, Cloudflare-friendly)

- [ ] **Set up project repository**
  - Initialize React + Vite project
  - Configure TypeScript (optional but recommended)
  - Set up Cloudflare Workers backend
  - Create `/config/workflows/` and `/config/templates/` directories

- [ ] **Configure development environment**
  - Database connection (local dev)
  - Cloudflare Workers local development
  - Environment variables structure

### 2. Architecture Decisions
- [ ] **Confirm tenant routing strategy**
  - Subdomain approach (brightsparks-york.platform.com)
  - Custom domain approach (brightsparks-york.com)
  - Both?

- [ ] **Authentication strategy**
  - Email/password (simple)
  - Google SSO (user-friendly)
  - Both?

- [ ] **API structure**
  - REST endpoints for CRUD operations
  - GraphQL (if preferred)
  - WebSockets for real-time updates?

## Week 1 Priorities (Phase 1 Start)

### Day 1-2: Database Foundation
**Goal**: Create multi-tenant database schema

**Tasks**:
1. **Create tenants table**
   ```sql
   CREATE TABLE tenants (
     tenant_id VARCHAR(255) PRIMARY KEY,
     domain VARCHAR(255) UNIQUE,
     company_name VARCHAR(255),
     trade VARCHAR(50),
     branding JSON,
     enable_photos BOOLEAN DEFAULT true,
     enable_suppliers BOOLEAN DEFAULT true,
     enable_materials BOOLEAN DEFAULT true,
     enable_location BOOLEAN DEFAULT true,
     enable_certifications BOOLEAN DEFAULT true,
     pricing_model VARCHAR(20) DEFAULT 'hourly',
     hourly_rate DECIMAL(10,2),
     materials_markup DECIMAL(5,2),
     enabled_fields JSON,
     workflow_template VARCHAR(50) DEFAULT 'standard',
     connectors JSON,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Create jobs table**
   ```sql
   CREATE TABLE jobs (
     job_id VARCHAR(36) PRIMARY KEY,
     tenant_id VARCHAR(255) NOT NULL,
     customer_id VARCHAR(36),
     job_type VARCHAR(100),
     status VARCHAR(50),
     scheduled_date TIMESTAMP,
     location VARCHAR(255),
     gps_coordinates VARCHAR(50),
     github_repo VARCHAR(255),
     deployment_url VARCHAR(255),
     test_coverage DECIMAL(5,2),
     labour_hours DECIMAL(10,2),
     labour_cost DECIMAL(10,2),
     materials_cost DECIMAL(10,2),
     total_cost DECIMAL(10,2),
     created_at TIMESTAMP,
     FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
   );
   ```

3. **Add tenant_id index for performance**
   ```sql
   CREATE INDEX idx_jobs_tenant ON jobs(tenant_id);
   CREATE INDEX idx_jobs_status ON jobs(tenant_id, status);
   CREATE INDEX idx_jobs_date ON jobs(tenant_id, scheduled_date);
   ```

### Day 3: Workflow Templates
**Goal**: Create markdown workflow definitions

**Tasks**:
1. **Create `/config/workflows/electrical-contractor.md`**
   ```markdown
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

2. **Create `/config/workflows/software-developer.md`**
   ```markdown
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

3. **Create workflow parser** (`/src/services/workflow-parser.js`)
   - Parse markdown files
   - Extract stages, transitions, notifications
   - Validate structure
   - Return JSON structure for app

### Day 4: Tenant Configuration Service
**Goal**: Build tenant config loader

**File**: `/src/services/tenant-config.js`

```javascript
// Simple tenant config loader
export async function getTenantConfig(tenantId) {
  const tenant = await db.tenants.findById(tenantId);

  return {
    id: tenant.tenant_id,
    trade: tenant.trade,

    modules: {
      photos: tenant.enable_photos,
      suppliers: tenant.enable_suppliers,
      materials: tenant.enable_materials,
      location: tenant.enable_location,
      certifications: tenant.enable_certifications
    },

    pricing: {
      model: tenant.pricing_model,
      hourly_rate: tenant.hourly_rate,
      materials_markup: tenant.materials_markup
    },

    workflow: await loadWorkflowTemplate(tenant.workflow_template),
    optionalFields: JSON.parse(tenant.enabled_fields || '[]'),
    branding: JSON.parse(tenant.branding)
  };
}

async function loadWorkflowTemplate(templateName) {
  const markdown = await fs.readFile(`/config/workflows/${templateName}.md`, 'utf-8');
  return parseWorkflowMarkdown(markdown);
}
```

### Day 5: Onboarding Script
**Goal**: Create command-line tenant onboarding tool

**File**: `/scripts/onboard-tenant.sh`

```bash
#!/bin/bash

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tenant-id=*) TENANT_ID="${1#*=}" ;;
    --trade=*) TRADE="${1#*=}" ;;
    --company=*) COMPANY="${1#*=}" ;;
    --domain=*) DOMAIN="${1#*=}" ;;
    --hourly-rate=*) HOURLY_RATE="${1#*=}" ;;
    --materials-markup=*) MATERIALS_MARKUP="${1#*=}" ;;
    --workflow=*) WORKFLOW="${1#*=}" ;;
    --template=*) TEMPLATE="${1#*=}" ;;
    --enable-all) ENABLE_ALL=true ;;
    --disable-photos) DISABLE_PHOTOS=true ;;
    --disable-suppliers) DISABLE_SUPPLIERS=true ;;
    --disable-materials) DISABLE_MATERIALS=true ;;
    --optional-fields=*) OPTIONAL_FIELDS="${1#*=}" ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

# Validate required fields
if [ -z "$TENANT_ID" ]; then
  echo "Error: --tenant-id required"
  exit 1
fi

# Load template if specified
if [ -n "$TEMPLATE" ]; then
  echo "Loading template: $TEMPLATE"
  # Load JSON template and merge with command-line args
fi

# Insert into database
echo "Creating tenant: $TENANT_ID"
psql $DATABASE_URL <<EOF
INSERT INTO tenants (
  tenant_id, domain, company_name, trade,
  enable_photos, enable_suppliers, enable_materials,
  pricing_model, hourly_rate, materials_markup,
  workflow_template, enabled_fields
) VALUES (
  '$TENANT_ID', '$DOMAIN', '$COMPANY', '$TRADE',
  ${ENABLE_PHOTOS:-true}, ${ENABLE_SUPPLIERS:-true}, ${ENABLE_MATERIALS:-true},
  'hourly', ${HOURLY_RATE:-60}, ${MATERIALS_MARKUP:-0.20},
  '${WORKFLOW:-standard}', '${OPTIONAL_FIELDS:-[]}'
);
EOF

echo "✅ Tenant created successfully!"
```

**Make executable**:
```bash
chmod +x /scripts/onboard-tenant.sh
```

## Week 1 Testing

### Test 1: Create Bright Sparks Tenant
```bash
./scripts/onboard-tenant.sh \
  --tenant-id="brightsparks-york" \
  --trade="electrical" \
  --company="Bright Sparks of York Ltd" \
  --domain="brightsparks-york.com" \
  --hourly-rate=60 \
  --materials-markup=0.20 \
  --workflow="electrical-contractor" \
  --enable-all
```

**Verify**:
- [ ] Tenant record exists in database
- [ ] All modules enabled
- [ ] Pricing configured correctly
- [ ] Workflow template loaded

### Test 2: Create DevFlow Tenant
```bash
./scripts/onboard-tenant.sh \
  --tenant-id="devflow-software" \
  --trade="software" \
  --company="DevFlow Software Ltd" \
  --hourly-rate=150 \
  --workflow="software-developer" \
  --disable-photos \
  --disable-suppliers \
  --disable-materials \
  --optional-fields='["github_repo","deployment_url","test_coverage"]'
```

**Verify**:
- [ ] Tenant record exists
- [ ] Photos/suppliers/materials disabled
- [ ] Optional fields configured
- [ ] Software workflow loaded

## Week 1 Acceptance Criteria

By end of Week 1, you should have:
- ✅ Database schema created and tested
- ✅ 2 workflow templates (electrical, software)
- ✅ Tenant config service working
- ✅ Onboarding script functional
- ✅ 2 test tenants created successfully

## Resources Needed

### Tools
- Database client (pgAdmin, TablePlus, or CLI)
- Code editor (VS Code recommended)
- Git for version control
- Node.js 18+ for local development

### Knowledge
- SQL basics (CREATE TABLE, INSERT, SELECT)
- Markdown syntax
- Bash scripting basics
- JavaScript/Node.js

### Access
- Database connection string
- Cloudflare account (for Workers)
- Domain registrar access (for custom domains)

## Questions to Answer Before Starting

1. **Database Choice**: PostgreSQL, MySQL, or Turso?
2. **Hosting**: Where will database be hosted? (AWS RDS, Cloudflare D1, Turso, local dev?)
3. **Authentication**: Email/password or Google SSO or both?
4. **Tenant Routing**: Subdomains or custom domains or both?
5. **Bright Sparks Data**: Do you have sample data (customers, jobs) for testing?

## Next Steps After Week 1

Once Week 1 is complete, you'll move to:
- **Week 2-3**: Build React UI components that load tenant config
- **Week 4-5**: Dynamic form rendering based on tenant modules
- **Week 6**: Create 4 more industry templates (plumber, builder, architect, web designer)
- **Week 7-8**: Testing with 10 diverse tenants, documentation

## Getting Help

If you get stuck:
1. Check the complete plan: [complete-plan.md](complete-plan.md)
2. Review specific phase details for more context
3. Test each component individually before integration
4. Ask questions early - don't assume requirements

---

**Document Version**: 1.0
**Last Updated**: 2024-12-14
**Status**: Ready to start Phase 1
