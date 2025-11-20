Documentation dies the moment you write it. Code changes, features evolve, and those carefully crafted README files become archaeological artefacts—interesting historical records of what the system used to do. Every software team knows this truth, yet most continue creating documentation destined for obsolescence.

Living documentation isn't a nice-to-have feature for well-funded teams. It's an essential practice for any project that wants its documentation to serve multiple audiences, stay accurate, and actually get used. When I built the Adobe Edge Delivery Services project, I faced this challenge directly. The solution I created—a browser-based executable notebook system—transformed how we document, demonstrate, and share knowledge across every team.

This post explains why living documentation matters for your project, no matter what you're building. Then I'll show you exactly how I implemented it, what worked, what didn't, and how you can apply these principles to your own work. I created this using Adobe Edge Delivery Services, Adobe Skills for Claude and EDS, and my docs/for-ai, as explained here: [https://allabout.network/blogs/ddt/integrations/the-convergence-completing-adobe-s-claude-skills-for-perfect-eds-ai-development](https://allabout.network/blogs/ddt/integrations/the-convergence-completing-adobe-s-claude-skills-for-perfect-eds-ai-development)

:living:

**Want to see it in action first?** [Experience the live documentation presentation →](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook)

**Note about the demo**: The live example is in presentation mode—showcasing the documentation structure, navigation, and visual design. It's technical (documenting a GitHub repository's documentation system) and deliberately self-referential. The same techniques work for documenting your API, component library, design system, or any project. For the fully interactive version with executable code cells, you'd download the notebooks and open them in the ipynb-viewer block on your own site.

## The Documentation Crisis or Why Static Docs Fail

### The Three Fatal Flaws

**Documentation Drift**: You write docs describing version 1.0. Six months later, you're on version 2.3, but the docs still reference old APIs, deprecated patterns, and features that no longer exist. Nobody updated them because updating the docs feels like duplicate work. The code already changed—why document it twice?

**Single-Audience Focus**: Developers write docs for developers, using technical jargon and assuming knowledge. Content teams can't use them. Sales can't demo from them. New hires struggle to understand them. Each audience needs different documentation, so you end up writing multiple versions, multiplying the maintenance burden.

**The Maintenance Burden**: Good documentation takes hours to create. Screenshots need to be captured, formatted, and updated. Examples need testing and validation. By the time you publish, something has already changed. The burden grows until teams give up and let docs decay.

### The Real Cost

These flaws cost more than you think. Developers waste time answering the same questions over and over. Content teams guess at requirements and end up creating broken content. Sales promises features that don't work as described. New hires take weeks longer to onboard. Clients lose trust when demos don't match reality.

When documentation fails, knowledge becomes trapped in individual heads. The person who built the feature becomes a bottleneck. The team becomes fragile. Every vacation, every departure, every sick day becomes a crisis.

## The Essential Solution

Living documentation solves these problems through three core principles: it executes, it demonstrates, and it serves everyone.

### Principle 1: Executable Truth

Living documentation contains runnable code. Not code samples that might work if you set up the environment correctly. Not screenshots of output that might have changed. Actual executable code that runs when you click a button and shows you current, accurate results.

When documentation executes, it can't lie. Either the code runs and produces results, or it visibly fails. Both outcomes provide value—working examples build confidence, failing examples reveal bugs or outdated information immediately.

**See the structure**: The [live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) shows the presentation mode with documentation organised into navigable sections. In the interactive version (when you implement this on your own site), users click "Run" on code cells and watch JavaScript execute in their browser with zero setup. Imagine executable examples for your REST API endpoints, React components, or database schemas.

### Principle 2: Self-Verification

Living documentation tests itself every time someone opens it. Every click of "Run" verifies that the example still works, the API still responds, and the transformation still produces the expected output. You don't need a separate testing suite—the documentation is the test suite.

This eliminates documentation drift automatically. When code changes break examples, the documentation becomes visibly broken. You can't ignore it because users see it fail. The documentation stays accurate or announces its own obsolescence.

### Principle 3: Multi-Audience Design

Living documentation serves different audiences through the same content. Developers see executable code, console output, and technical details. Content teams see visual transformations, formatting requirements, and before/after comparisons. Sales teams can run interactive demos on demand. New hires know both explanation and proof.

But multi-audience design goes beyond just showing different things to different people. It's about supporting how people actually think about and approach documentation. In building my system, I discovered people navigate documentation in three distinct ways:

**Role-Based Navigation**: "I'm a new developer", or "I create content", or "I'm an architect." People come to documentation with a role identity and want paths tailored to their expertise level and responsibilities.

**Task-Based Navigation**: "I need to build an accordion block" or "I need to test this component", or "I need to debug a performance issue." People arrive with specific problems and want direct routes to solutions.

**Workflow-Based Navigation**: "I'm in the planning phase", or "I'm testing now", or "I need to document before deployment." People operate in phases and want documentation organised by their position in the development lifecycle.

Effective living documentation doesn't force users into one navigation model—it supports all three simultaneously. The same executable example serves the new developer learning patterns, the experienced developer solving a specific problem, and the architect evaluating approaches.

One document, multiple perspectives, multiple mental models. One maintenance burden, universal value.

**Experience the navigation structure**: [Open the live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) and see how documentation can be organised by role, task, and workflow phase using the hamburger menu navigation. The example shows EDS documentation organisation, but the same role/task/workflow patterns apply to your Kubernetes cluster docs, your GraphQL schema, or your design system guidelines.

## Building It

When I started building blocks for Adobe Edge Delivery Services, I faced a specific documentation challenge. I needed to explain complex content transformations to multiple audiences—developers who would build blocks, content teams who would use them, sales teams who would demonstrate them, and clients who would evaluate them.

Traditional documentation wouldn't work. Screenshots would become outdated as blocks evolved. Written explanations wouldn't satisfy developers who wanted to see actual code. Separate documentation for each audience would create an unmaintainable sprawl.

I needed living documentation—a GPS for documentation, not just a static map, but an active guide helping users find exactly what they need when they need it. Here's how I built it.

### Browser-Native Execution

The breakthrough came from recognising that browsers already contain everything needed to test and demonstrate EDS blocks: JavaScript execution, DOM manipulation, CSS rendering, block decoration—all native browser capabilities.

Most interactive notebook systems require setup: installing Node.js, configuring kernels, and setting up environments. I eliminated all of that. Open the page. Click "Run". Watch the result appear—zero setup, pure browser execution.

Each code cell imports what it needs at execution time:

`const { testBlock } = await import('/scripts/ipynb-helpers.js');`

`const block = await testBlock('accordion', content);`

No initialisation. No dependencies. No configuration. Cells run independently, in any order, from any device with a browser.

### Making Documents Interactive

I built this system as an EDS block called ipynb-viewer. It transforms Jupyter notebook files (.ipynb) into interactive web documents. Add the block to any page, reference a notebook file, and it renders the notebook with interactive "Run" buttons on every code cell.

The architecture is deliberately simple:

**Fetch and Parse**: The block fetches the notebook JSON and parses its structure—markdown cells become formatted explanations, code cells become executable demonstrations.

**Render Markdown**: Enhanced markdown parsing supports code blocks, tables, lists, and inline formatting. Documentation reads naturally for all audiences.

**Execute JavaScript**: Click "Run" to run JavaScript in the browser using AsyncFunction, capture console output for debugging, display results and return values, and show errors with clear formatting.

**Visual Previews**: Special helper functions, such as showPreview(), open full-screen overlays that display blocks with complete styling and interactivity. Content teams see exactly how their content will appear. Sales demonstrate without leaving the documentation. Developers verify styling without deployment.

**See the presentation**: [Visit the live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) to see the documentation structure and navigation in presentation mode. When implemented with full interactivity, users click "Run" on cells with `showPreview()` to see full-screen visual results. How does this same visual overlay technique work for previewing your components, your email templates, or your data visualisation dashboards?

### Design Decisions and Tradeoffs

**Read-Only by Design**: Users can't edit code in these notebooks. This is intentional. These documents serve as authoritative demonstrations and tutorials. People learn from carefully crafted examples that always work. For experimentation, developers use separate development tools.

**Browser Limitations**: Complex computations can slow browsers. Network requests require CORS configuration. Debugging tools are less comprehensive than IDEs. These are acceptable trade-offs for the benefit of zero-setup universal access.

**Multiple Display Modes**: I built different viewing modes for different use cases:

- **Default mode**: Scrollable document showing all cells at once
- **Paged mode**: Full-screen overlay with one cell per page, Previous/Next navigation
- **Autorun mode**: Cells execute automatically without clicking the Run buttons
- **Notebook mode**: Combined paged view with hamburger menu navigation and manual execution

Each mode serves specific scenarios. Paged mode works beautifully for presentations. Autorun mode creates self-running demonstrations. The hamburger menu in notebook mode lets users jump directly to any section with smart filtering that shows only relevant items—essential for long tutorials that require quick navigation to relevant content.

**Auto-Wrapping in Notebook Mode**: A breakthrough innovation came from eliminating 90% of the HTML authoring burden. In notebook mode, you can write pure markdown without any HTML wrappers. The system automatically detects content patterns—hero cells (first cell with `#` heading), intro cells (early cells with `##`), transition cells (short text without headers), and content cells—and wraps them with appropriate styling classes. This means documentation authors write clean, simple markdown, and the system handles all the presentation styling automatically. Content that used to require verbose HTML divs with inline styles now requires just natural markdown headings and paragraphs.

**See presentation mode**: The [live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) shows the notebook mode with paged navigation and a hamburger menu. When you implement this system, you can choose from multiple viewing modes for different use cases. The example shows EDS block documentation, but the same viewing modes apply to your infrastructure documentation (paged for runbooks), your API guides (autorun for demonstrations), or your onboarding materials (notebook mode for structured learning).

### Technical Innovations Worth Noting

**Import-As-Needed Pattern**: Each cell stands completely alone. No initialisation blocks. No required execution order. This independence makes documentation robust and flexible.

**Overlay System Architecture**: Instead of pop-up windows (which are blocked by browsers), I use full-screen overlays on the same page. Preview overlays for visual results, manual overlays for documentation access, and paged overlays for presentation mode. They stack properly—ESC key closes them in order without losing your place.

**Intelligent Cell Grouping**: In paged mode, the system automatically groups related cells. When markdown explains a concept and the next cells demonstrate it, they appear together on one "page". This creates a better learning flow without manual page definition.

**Link Navigation**: Hash links in markdown cells enable navigation between pages. Create a table of contents with clickable links that jump users directly to relevant sections. This transforms long documents into navigable references.

**Smart TOC Generation**: The hamburger menu navigation uses intelligent filtering—it detects cell types via CSS classes (hero cells, transition cells) rather than hardcoded text patterns. This means the table of contents automatically adapts to any notebook content, skipping cells without headings and showing visual dividers between major sections. The TOC works seamlessly with auto-wrapped markdown, requiring zero manual configuration.

**Action Cards for Navigation**: A pure markdown pattern for creating beautiful navigation cards. Add `<!-- action-cards -->` comment followed by a list with emoji indicators (🔵 blue, 🟢 green, 🟠 orange) and the system automatically transforms them into styled, interactive cards with hover effects. Perfect for hero cells, section navigation, and tutorial flow without writing any HTML.

## Real-World Impact \- How Living Documentation Changed Everything

### From Maintenance Burden to Self-Documenting Code

Before living documentation, I spent hours creating block documentation. Write explanations, capture screenshots, format examples, and test everything manually. The moment I published, something would change, and the docs would start drifting.

With living documentation and Claude AI, the same comprehensive documentation can be generated in minutes. I describe what I want—"show content teams how the accordion block transforms their tables with visual examples"—and Claude generates complete notebooks with plain-English explanations and executable demonstrations.

More importantly, the documentation maintains itself. When I change a block, the examples fail visibly if they're affected. I fix the examples, and they become regression tests. The documentation is the test suite.

### From Confusion to Confidence

Content authors previously struggled with block requirements. "Why does my accordion look broken?" Because your table structure doesn't match the expected format. But explaining table structure in words never quite worked.

Living documentation transformed this completely. Content teams open a notebook, see a table structure labelled "this is what you create", click Run, and watch the transformation happen. They understand why structure matters because they know the result.

### From Scepticism to Belief

Sales teams previously struggled to demonstrate their capabilities convincingly. PowerPoint slides make claims. Static screenshots show past states. Neither builds the confidence that comes from watching something work right now.

Living documentation gives sales teams executable demonstrations. "Let me show you how content transforms into an accordion"—click Run, watch the transformation happen, and show the styled preview overlay. The client sees it work, not a video of it working.

Clients move from "sounds good in theory" to "I just watched it work". Trust builds through demonstration, not persuasion.

**Share documentation beautifully**: The [live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) demonstrates how to present documentation professionally. When you implement the full interactive version, prospects can explore capabilities and execute examples on their own time—no setup, no installation. This example shows technical documentation, but imagine sending prospects an interactive demo of your SaaS features, your data processing pipeline, or your mobile app API—all executable in their browser without installation.

### From Weeks to Days

New hires previously needed extensive onboarding. Read documentation, set up the environment, learn patterns, and build confidence. Days of preparation before they could contribute meaningfully.

Living documentation accelerates this dramatically. New developers open notebooks, read explanations, click Run to see results, and understand patterns through interaction. They learn both the "what" and the "why" simultaneously.

Content team members learn block capabilities without technical training. They understand requirements visually. They build confidence by watching examples executed successfully.

## The Efficiency Revolution

Creating comprehensive block documentation manually consumes hours per block. With Claude and the living documentation system, the same documentation takes minutes.

It's a shift in how documentation happens. Documentation becomes something you create as you build, not something you write after the fact. The burden disappears.

More importantly, the quality improves. Claude generates documentation that serves multiple audiences simultaneously. Developers get technical details. Content teams get visual examples. Sales gets interactive demonstrations. All from a single source of truth that took minutes to create.

## Beyond My Project

The principles behind this system apply far beyond Adobe EDS. Any project with multiple audiences, changing code, or complex demonstrations can benefit from living documentation.

### Component Libraries

Building React, Vue, or Web Components? Living documentation lets you:

- Show components rendering with different props  
- Demonstrate state changes interactively  
- Prove styling works across breakpoints  
- Test edge cases visually

Your component library documentation becomes an executable test suite. Developers verify behaviour. Designers see styling. Product managers understand capabilities.

### API Documentation

Documenting REST or GraphQL APIs? Living documentation enables:

- Executable API requests with real responses  
- Visual schema exploration  
- Interactive query building  
- Error scenario demonstrations

API documentation that makes actual requests proves the API works. Developers trust it because they see the current behaviour. Integration teams understand patterns by watching requests execute.

### Design Systems

Maintaining design systems across teams? Living documentation provides:

- Interactive pattern libraries  
- Accessibility testing in-browser  
- Responsive behaviour demonstrations  
- Theme variations side-by-side

Design system documentation that executes proven patterns. Designers see real rendering. Developers get working code. Teams maintain consistency through shared truth.

### Technical Training Materials

Creating training content? Living documentation delivers:

- Progressive tutorials with executable steps  
- Concept demonstrations that users can run  
- Before/after transformations  
- Interactive learning without environment setup

Training materials that are executed teach better. Learners understand by doing. Instructors prove that concepts work. Everyone learns from the same accurate examples.

### Open Source Projects

Building open source software? Living documentation helps:

- Onboard contributors faster  
- Demonstrate features convincingly  
- Maintain accurate examples  
- Build community trust

Open source projects with living documentation attract better contributors. People understand the project by watching it work. They contribute confidently because examples prove correctness.

## Principles for Any Project

You don't need to build exactly what I built. You need to apply the principles of living documentation to your specific context.

### Start with Multi-Audience Thinking

Identify all audiences for your documentation: developers, content teams, sales, support, clients, and new hires. Document what each audience needs to know. Design examples that serve multiple audiences simultaneously.

A single interactive example can show developers the code, content teams the result, and sales the capability: one maintenance burden, universal value.

### Make It Executable

Find ways to make your documentation run. If you're documenting JavaScript, use browser-based execution. If you're documenting APIs, make actual requests. If you're documenting components, render them interactively.

Executable documentation can't drift—it either works or fails visibly. This automatic verification keeps documentation accurate without manual testing.

### Eliminate Setup Barriers

The less setup required, the more people will use your documentation. Zero setup means universal access. Browser-based execution involves nothing. Cloud-based notebooks require just a login. Desktop tools require installation and configuration.

Optimise for the lowest possible barrier to entry. More people using documentation means more feedback, more trust, and more value.

**See zero-setup in action**: [Open the live demo](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) in any browser—no installation, no login, no configuration. The presentation loads instantly. When you implement the full interactive version, users get the same zero-setup experience plus executable code. The demo is technical (it documents a documentation system—it's meta\!). Still, the principle applies universally: whether documenting Python libraries, cloud infrastructure, or data pipelines, zero-setup browser execution makes documentation accessible to everyone.

### Design for Discovery

Create navigation that lets users jump to relevant content—such as a table of contents with links, search functionality, and section menus. Long documents need structure.

But discovery isn't just about navigation—it's about helping users make decisions. One of the most powerful patterns I implemented was decision trees embedded directly in the documentation. Instead of just explaining options, the documentation guides users through choices:

"Should I use a simple or complex approach?"

- External dependencies needed? → Complex approach  
- Build process required? → Complex approach  
- Otherwise? → Simple approach

These decision trees don't just inform—they actively guide users to the proper documentation for their context. Combined with my hamburger menu navigation in notebook mode, users can jump directly to any section without having to click through dozens of pages.

Your living documentation needs this same philosophy: don't just document everything—help users find the right thing for their situation: decision trees, progressive disclosure, contextual navigation. Guide, don't just inform.

### Leverage AI Generation

Tools like Claude can generate comprehensive documentation in minutes. Describe what you want and let AI create the structure, examples, and explanations. You review, refine, and publish.

This isn't about replacing human judgment—it's about eliminating the mechanical burden of documentation creation. Focus on what should be documented; let AI handle how to report it.

Beyond generating content, AI can power automated processes that implement documentation recommendations. In my system, I created slash commands like `/new-block`, `/test-block`, and `/create-notebook` that don't just tell developers what to do—they do it automatically, following best practices. Documentation becomes executable not just in examples, but in the tools themselves.

### Embrace Progressive Disclosure

Here's a truth I learned: you don't need to read everything. You need to know three things: where things are, how to find them, and when to use them.

Organise your living documentation by categories (implementation, testing, guidelines, reference). Create clear entry points for each role and workflow. Build decision trees that route people to relevant sections. Use progressive disclosure—show summaries first, details on demand.

In my EDS documentation, I created three distinct types of Jupyter notebooks for progressive disclosure:

- **Testing notebooks** for developers needing interactive development with technical details  
- **Educational notebooks** for learners wanting step-by-step tutorials with explanations  
- **Presentation notebooks** for clients to see polished demos without code complexity

Same underlying system, three levels of depth. Users choose their own level based on context and expertise. This is how living documentation scales—not by documenting less, but by organising for discovery and progressive revelation.

## My Open-Source Implementation

The complete system is available at [github.com/ddttom/allaboutV2](https://github.com/ddttom/allaboutV2). You'll find:

- The ipynb-viewer block implementation  
- Helper utilities for browser-based testing  
- Example notebooks demonstrating patterns  
- Complete documentation of the system itself (meta-documentation using living documentation)

You can use this directly if you're building on Adobe EDS. Or study the architecture and apply the principles to your own stack. The code is open source. The patterns are universal.

**But first, see it presented**: [View the live documentation presentation](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook) before diving into the code. The presentation mode shows structure and navigation—understanding this user experience helps you appreciate the architectural decisions. The demo is self-referential (documentation documenting itself), which makes it perfect for learning—you see the principles applied to the very system teaching them. The same patterns work for your Redux store documentation, your Terraform modules, or your microservices architecture.

## Living Documentation as Essential Practice

Building this browser-based executable notebook system taught me that the best documentation doesn't just describe—it demonstrates, executes, and proves itself with every interaction.

Living documentation isn't a luxury for well-funded teams. It's an essential practice for any project that values accuracy, multi-audience accessibility, and knowledge sharing. The cost of inadequate documentation—wasted time, confused teams, lost trust—far exceeds the effort required to build systems that make documentation come to life and breathe.

Whether you're building component libraries, APIs, design systems, training materials, or open-source projects, the principles apply: make it executable, eliminate setup, serve multiple audiences through multiple navigation models, embed decision trees for guidance, use progressive disclosure for scale, and leverage AI for both content generation and workflow automation.

When documentation executes, demonstrates, and proves itself with every click, trust builds automatically. When anyone can click "Run" and see results, knowledge spreads naturally. When Claude generates comprehensive multi-audience documentation in minutes instead of hours, teams focus on building rather than explaining.

The documentation crisis—drift, single-audience focus, maintenance burden—has a solution. Living documentation isn't the future. It's an essential practice for modern software projects. The question isn't whether to adopt it, but how to implement it for your specific context.

I built my implementation to solve a real problem: documenting Adobe EDS blocks. The result serves developers, content teams, sales, clients, and new hires through the same interactive documents. It's deliberately self-referential—documentation that documents itself—which makes it both a working example and a learning tool. The same principles can transform how your project shares knowledge, builds trust, and maintains accuracy, whether you're documenting REST APIs, Python packages, infrastructure-as-code, or internal tooling.

Documentation that lives and breathes benefits everyone.   
---

## Experience Living Documentation Now

**See everything discussed in this article:**

🚀 [**View the Documentation Presentation**](https://allabout.network/blogs/ddt/integrations/live-jupyter-notebook)

What you'll see:

- ✅ Professional documentation presentation in notebook mode  
- ✅ Navigation organised by role, task, and workflow using hamburger menu  
- ✅ Decision trees guiding users to relevant content  
- ✅ Zero-setup access that loads instantly  
- ✅ Full-screen paged navigation between sections  
- ✅ Documentation structure showcasing living documentation principles

No installation. No setup. No login. Just open and explore the presentation.

**Note**: This is presentation mode showing structure and navigation. The full interactive version (with "Run" buttons executing code in the browser) requires implementing the ipynb-viewer block on your own site. This demo shows what's possible—you can build the same for your project.

**For developers ready to build:**

- 📦 [**Explore the source code**](https://github.com/ddttom/allaboutV2) \- Open source implementation  
- 📖 [**Read the technical docs**](https://github.com/ddttom/allaboutV2/tree/main/docs/for-ai) \- Architecture and patterns  
- 🔧 [**Study the ipynb-viewer block**](https://github.com/ddttom/allaboutV2/tree/main/blocks/ipynb-viewer) \- Core implementation

The best way to understand living documentation is to experience it. The best way to adopt it is to study a working implementation. Both are available now.

**Documentation that lives and breathes benefits everyone. Experience it first. Then make yours execute.**