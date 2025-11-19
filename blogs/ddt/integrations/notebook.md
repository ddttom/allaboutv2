Living Documentation: When Code Proves Itself
Creating comprehensive block documentation manually consumes over two hours. With Claude and Adobe's EDS Skills, the same documentation takes eight minutes. Describe what you want - "show content teams how the accordion block transforms their tables" - and Claude generates complete notebooks with plain-English explanations and executable demonstrations. These become documents that serve every audience. Developers test code directly, content teams watch their formatting requirements in action, sales demonstrates capabilities through live transformations, and new hires learn by watching examples run. Documentation can't become outdated when every example executes, every transformation appears visually, and every content structure gets verified by clicking "Run”.

Zero Setup, Pure Browser Execution
Traditional Jupyter notebooks require installations, kernels, and configuration - our browser-based system eliminates all of these. No setup requirements, no environment configuration - just click "Run" and watch the results appear. Each code cell stands alone, importing what it needs at execution time. Users can run any cell in any order from any device with a browser. The breakthrough came from recognising a simple truth - browsers already contain everything needed to test EDS blocks, transform content, and display styled previews instantly.
 
:living:
Experience It Yourself
Before diving into technical details, see the system in action: https://allabout.network/blogs/ddt/integrations/live-version-of-the-ipynb-blog-post
The Vision Behind Living Documentation
We wanted to solve a fundamental problem. How do you make block documentation interactive and trustworthy for everyone - developers, content teams, marketers, and clients - without requiring any technical setup?

Developers needed a way to test EDS blocks instantly without requiring environment configuration. They wanted to debug block decoration logic with immediate feedback, share reproducible test cases that always work, and generate styled previews in browser overlays.

Content teams needed different things. They wanted to see exactly how content transforms into blocks, understand formatting requirements visually, verify content structure without reading code, and learn block capabilities through interaction.

Everyone else - from sales to support - needed to run examples without installing anything, trust documentation because it proves itself, learn through doing rather than reading, and access knowledge from any device with a browser.

The solution emerged naturally. Create documents where notebooks execute entirely in the browser. No Node.js, no kernel selection, no initialisation - just click "Run" and watch transformations happen.
The Technical Innovation - Import When Needed
Most interactive notebook systems require setup steps, initialisation code, or environment configuration. We wanted something different - notebooks that simply work. Open the page, click "Run", and see the results.

The breakthrough came from removing initialisation entirely. Each code cell imports what it needs at the moment it needs it. Browsers already contain everything - JavaScript execution, DOM manipulation, and the actual EDS blocks. Setup becomes unnecessary.

This independence means content teams can run any example without following sequences. Developers can test specific scenarios without context. Support can reproduce issues with single clicks. Sales can demonstrate features in any order.
The ipynb-viewer Block - Making Documents Come Alive
The entire system centres on a single EDS block called ipynb-viewer. This block transforms static Jupyter notebook files into interactive documents that serve every audience.

When you add the ipynb-viewer block to a page, you reference a notebook file. The block fetches the notebook JSON, parses its structure, and renders it as an interactive document. Markdown cells become formatted explanations in plain English. Code cells become executable demonstrations with prominent "Run" buttons.

The magic happens when anyone - developer or content author - clicks "Run". The block executes JavaScript in the browser context, captures console output for developers, displays visual results for content teams, and shows transformations for everyone.

Users experience the code running, but cannot edit it. This read-only design is intentional. These documents serve as authoritative demonstrations and tutorials where people learn from carefully crafted examples that always work.
Enhanced Markdown for Clear Communication
Our markdown parser handles complex content intelligently. Code blocks get highlighted for developers. Tables show content structure for content teams. Lists explain requirements for everyone. Headers organise concepts. Inline formatting adds clarity.

The parser processes nested cases where table cells contain code or lists include formatted text. This creates documentation that speaks to technical and non-technical audiences simultaneously.
Interactive Execution Serves All Audiences
Each code cell displays a clear "Run" button. Click it, and different audiences see different value.

Developers see JavaScript execution with async/await support. Console output includes logs and errors. Return values and timing metrics appear. Real DOM transformations happen before their eyes.

Content teams see their table structure before transformation. The resulting block after decoration appears clearly. Visual previews of the final output demonstrate the change. Apparent success and failure indicators remove ambiguity.

Everyone sees immediate results without waiting. Fundamental transformations, not simulations. Prove the documentation works. Learning through interaction.
The Power of Living Examples
Building Confidence Through Simple Tests
The simplest example creates a fundamental element. The code creates a div, adds styling, and displays the result. Content teams click "Run" and understand how HTML becomes visual elements. Developers click "Run" and verify the browser environment works correctly. Both audiences build confidence through the same document.
Block Transformation Shows Core Value
The next level demonstrates actual block transformation. The document imports the testBlock helper, creates content in EDS table format, runs the transformation, and returns decorated HTML.

Content teams click "Run" and understand why their table with Question/Answer rows becomes an accordion. Developers click "Run" and verify the block decoration executes properly.
Visual Learning Through Before and After
Living documents excel at showing transformation. Your content structure begins with two nested divs, each containing questions and answers. After decoration, it becomes two interactive accordion sections.

Content teams finally understand why their tables need specific structures. Developers see precisely what the decoration function does. Everyone learns through visual comparison.
Preview Overlays - Seeing Like Users Do
The most powerful feature for non-technical users might be the preview overlay. Instead of reading about blocks, people see them.

Click "Run" on a preview cell, and a full-page overlay appears. The block renders with complete styling. Interactive features work - accordions expand, carousels slide. Press ESC to dismiss and continue learning.

Content teams experience their content as end users will see it. Sales teams demonstrate without switching contexts. Developers verify styling without deployment.
Notebook Mode - The Complete Learning Experience
The notebook variation combines everything into a comprehensive educational platform. Click "Start Reading" to enter full-screen paged mode where cells display one at a time. Navigate with Previous/Next buttons or keyboard arrows. Access documentation instantly with the "Read the Manual" button. Execute code when you're ready with manual Run buttons.

The breakthrough feature is the hamburger menu navigation. Click the menu icon in notebook mode and a dropdown appears showing every section in your document. Smart filtering excludes title slides while visual dividers mark major transitions between parts. Jump instantly to any section - Part 2, Part 5, specific topics - without clicking through dozens of pages.

This transforms long tutorials into navigable experiences. Content teams jump to relevant sections. Developers skip to technical details. Sales demonstrate specific features on demand. Everyone explores at their own pace with their own path through the knowledge.

The overlay system respects hierarchy. Preview overlays from running code appear on top. The manual overlay sits beneath. The paged notebook overlay forms the base. Press ESC and overlays close in order - preview first, then manual, finally the notebook itself. Previous/Next navigation continues working beneath other overlays. You never lose your place.
Presentation Mode - Automatic Demonstration
Sometimes you need documentation that demonstrates automatically. Presentation mode combines paged navigation with automatic code execution. No Run buttons appear. Code executes immediately when each page displays. Results appear without user action.

This mode transforms living documents into live presentations. Sales demonstrates features without clicking Run buttons. Training sessions show transformations automatically. Client demonstrations flow smoothly from concept to working example. Marketing creates video content where code executes on cue.

The autorun variation works everywhere - in default scrolling view where all cells execute on page load, or in paged overlay where each cell executes as you navigate to it. Content appears, code runs, results display. The audience watches transformations happen in real-time.

Combine this with the hamburger menu and you get truly flexible presentations. Jump to any section, watch it execute automatically, navigate to questions, demonstrate specific features. The same document serves both self-paced learning and live presentation without modification.
Living Documentation Handles Every Scenario
Edge Cases Everyone Understands
Living documents make edge cases visible to all. Empty content? Run the cell, see graceful handling. Single item? Run the cell, check if navigation appears. Fifty items? Run the cell, observe performance impact.

Content teams learn limits. Developers verify robustness. Quality assurance confirms behaviour.
Teaching JavaScript Fundamentals
Not everything involves blocks. Living documents teach JavaScript basics, too. Array operations with visual output. String transformations with precise results. Calculations with step-by-step logs.

New developers learn the language. Content teams understand the logic. Everyone gains technical literacy.
The Workflow Revolution
Content Teams Understand Without Code
Content teams no longer guess how blocks work. They open a document, read plain-English explanations, click "Run" to see transformations, and understand requirements visually. No code reading required. No developer translation needed—direct understanding through interaction.
Developers Create Self-Verifying Documentation
Developers create documents that test automatically by running, update by failing visibly, share knowledge through examples, and onboard new team members interactively. Documentation drift disappears. If it runs, it's correct.
Organisations Gain Universal Truth
Living documents become the single source of truth. Sales demonstrates actual capabilities. Support reproduces real issues. Training teaches through interaction. Documentation self-verifies continuously. Everyone references the same living knowledge.
Creating Documentation with Claude
Here efficiency meets accessibility. Claude creates comprehensive living documents in minutes, understanding both the technical requirements and the audience's needs.

Claude uses Adobe's EDS Skills for workflow patterns, technical documentation for implementation, understanding of content team needs, and awareness of various audience levels. This enables the generation of documents that speak to everyone.
Natural Language Produces Universal Output
Tell Claude to create a living document that shows content teams how the accordion block works, with examples they can understand. Claude generates plain-English explanations of content requirements, provides visual before-and-after demonstrations, highlights common mistakes and solutions, and includes examples using familiar content.

Request technical documentation for accordion edge cases with performance metrics. Claude generates code cells with timing measurements, console output explanations, memory usage indicators, and optimisation suggestions.

Request an accordion guide for all audiences, including content, development, and sales. Claude generates an overview that everyone understands, technical details in expandable sections, visual demonstrations for non-technical users, and interactive examples for all levels.
Effective Prompt Patterns
Strong prompts for multi-audience documentation follow patterns. "Create a living document for [audience] showing [concept]" works well. "Generate examples content teams can run without code knowledge" gets specific results. "Build progressive tutorials from non-technical to advanced" creates learning paths. "Show [block] behaviour visually for all audiences" ensures accessibility.
Real Session Example
You request living documentation for the carousel block that helps both content teams and developers. Claude generates an introduction in plain English explaining carousels. Content structure is conveyed through visual examples that content teams can understand. A basic demo allows users to click "Run" and view three slides. Content requirements show table structure with clear labels. Advanced features cover auto-play and navigation options. Developer sections include performance metrics and customisation. Common issues get solutions that both teams can verify.

Total time - five minutes. Result - documentation serving all audiences.
Why Living Documents Succeed
Browser execution combined with multi-audience design creates something special.

Anyone with a browser can learn—no tools, no setup, no technical knowledge required. Documentation proves itself with every click. Seeing builds confidence. Visual results speak to everyone. Technical details remain available but are not required. Living documents can't lie - they work or they visibly don't. Claude generates comprehensive documentation in minutes, not hours.
Publishing Your Living Documents
Getting living documents onto your EDS site takes five steps. Create notebook content manually or with Claude. Save with .ipynb extension. Upload to your repository. Add an IPython Notebook Viewer block to a page. Publish.

Content teams access the same URL as developers. Sales opens the same page as support. Everyone experiences documentation that simply works.
How Documentation Changed
Our approach to documentation has undergone a complete transformation. Previously, we'd write documentation, take screenshots, and hope it stayed current, while also answering questions when it didn't. Now we create living documents that prove themselves. Everyone understands visually. Knowledge maintains itself.

The efficiency gain staggers the mind. What took hours now takes minutes. What confused non-developers now enlightens them. What became outdated stays current automatically.
Real-World Impact
Content Teams Move from Confusion to Confidence
Content authors now understand block requirements through interaction. They see their content transform, understand why structure matters, and verify their formatting works - all without reading code.
Developers Trade Documentation Burden for Living Knowledge
Developers create documentation that maintains itself. Examples test automatically. Knowledge spreads through interaction, not explanation.
Organisations Break Down Silos
Sales demonstrates with developer-created examples. Support uses content team tutorials for training. Everyone references the same living truth.
Clients Replace Scepticism with Belief
Clients see capabilities, not claims. They watch transformations happen. They experience features working. Living documents remove doubt.
An Honest Assessment
Where Living Documents Excel
Living documents demonstrate block transformations visually. They teach through interaction, not reading. Multiple audiences are served simultaneously. Accuracy self-verifies continuously. Trust builds through demonstration.
Current Limitations
The read-only design prevents experimentation. Browser security restrictions apply. Network requests require CORS configuration. Complex computations can slow browsers. Debugging tools remain limited compared to IDEs.

The key lies in using each tool appropriately. Living documents for demonstration and learning. Development tools for creation and debugging.
Building with AI - Eight-Minute Documentation
I built this system using Claude, applying Adobe's Skills and comprehensive documentation. The efficiency transforms work completely.

Manual documentation takes two or more hours of writing, testing, formatting, and explaining. Claude-generated living documents take eight minutes from request to publication.

The breakthrough goes beyond speed. Claude creates documentation serving everyone, understanding that content teams need visual examples while developers want technical details.
Key Innovations
The ipynb-viewer block automatically transforms notebooks into living documents. The import-as-needed pattern means each cell stands alone without initialisation. Browser-native execution provides a real environment, real blocks, and real results. The overlay preview system shows full styling without leaving the page. Notebook mode provides comprehensive navigation with hamburger menu, table of contents, and instant section jumping. Presentation mode enables automatic code execution for live demonstrations and training. Smart filtering excludes decorative cells while visual dividers mark transitions. Multi-audience design means the same document serves all teams. Read-only focus encourages learning from examples rather than experimentation. Claude integration turns natural language into living documentation in minutes.
The Repository
Find everything at github.com/ddttom/webcomponents-with-eds. Working examples everyone can run. The ipynb-viewer implementation. Helper utilities. Comprehensive documentation.
Documentation That Lives and Breathes
Building this browser-based notebook system taught us a fundamental lesson. The best documentation doesn't just describe - it demonstrates. Removing setup complexity and making everything run in the browser eliminated every barrier between people and knowledge.

Living documents transform how organisations share knowledge. Content teams understand without translation—developers' document without maintenance burden. Sales demonstrate without preparation. Support troubleshoots without reproduction steps. Clients believe without persuasion.

The impact compounds over time. When documentation executes, demonstrates, and proves itself with every click, trust builds automatically. When anyone can click "Run" and see results, knowledge spreads naturally. When Claude generates comprehensive multi-audience documentation in eight minutes instead of two hours, teams focus on building rather than explaining.

Whether you're a content author understanding block requirements, a developer debugging transformations, or a client evaluating capabilities, the same living documents serve you. Click "Run" on any cell, in any order, and it simply works.

That's the power of documentation that lives and breathes, not just for developers, but for everyone.
