You are an expert Franklin Developer

# dam block

## AI Prompt, (c) Tom Cranstoun, September 2024, V 1.0

**Goal:** Create a Franklin block named blogroll that contains a visually appealing list of blog posts, from the json file at this url https://allabout.network/blogs/ddt/query-index.json

The json is a published index, as new blog posts are added the json gets updated, do not treat the json as static.

the field longdescription may be blank, when it is blank the filed description should be copied into it

last modified is a typical internet time stamp, convert it to dd/mm/yyyy format
obtain the list of blog paths, noting when there are multiple parts by the path ending im  Part x, where x is an integer and the word part is in any case.

the blog posts should be collected by path and ordered by name without the Part - x; 

A subtitled block should be created to hold all the children posts. the children posts should be sorted by integer number, if available.





the json looks like this

{
total: 30,
offset: 0,
limit: 30,
data: [
{
path: "/blogs/ddt/",
title: "Toms Blog Index Page",
image: "/blogs/ddt/media_12c0a9929cd862a502c940d01c2157756622fe8b3.png?width=1200&format=pjpg&optimize=medium",
description: "The index page of the blogs of a seasoned AEM architect",
longdescription: "",
lastModified: "1726853137"
},
{
path: "/blogs/ddt/a-managers-guide-to-document-authoring-with-edge-delivery-services",
title: "A manager’s guide to Document Authoring with Edge Delivery Services",
image: "/blogs/ddt/media_13cd1a6707e9b077826a405fed46b2f3c60bbae7a.jpeg?width=1200&format=pjpg&optimize=medium",
description: "A web page describing how Edge Delivery Services works",
longdescription: "",
lastModified: "1720279421"
},
{
path: "/blogs/ddt/ai-generated-code",
title: "AI-Generated Code",
image: "/blogs/ddt/media_107ec17c46e9e61d881724559b7c8ff7d5ff53982.png?width=1200&format=pjpg&optimize=medium",
description: "This is AI-generated code from a one-shot prompt",
longdescription: "",
lastModified: "1725541413"
},
{
path: "/blogs/ddt/ai-powered-development",
title: "AI-Powered Development",
image: "/blogs/ddt/media_1072b12c4580da4057cdc38d91cc2ecfb636072d6.png?width=1200&format=pjpg&optimize=medium",
description: "An article explaining a recent presentation",
longdescription: "",
lastModified: "1726514002"
},
{
path: "/blogs/ddt/allaboutmarketing",
title: "allabout.network | our offer",
image: "/blogs/ddt/media_16139f8fda41eb9ed3728d9998dfbfe38c6aca5a6.png?width=1200&format=pjpg&optimize=medium",
description: "Want to create a stunning, personalised web page to share your event, passion project or holiday memories? Keep your story from getting lost in the social media shuffle or buried under ads.  Introducing allabout.network: Your easy solution to creating and hosting beautiful web pages without the tech hassle.",
longdescription: "",
lastModified: "1721906015"
},
{
path: "/blogs/ddt/code-expander-block-showcase",
title: "Code Expander Block Demo",
image: "/blogs/ddt/media_1172203b3684b403431c8a40d8cf69c6aceccca69.png?width=1200&format=pjpg&optimize=medium",
description: "A demonstration of the Code Expander block functionality",
longdescription: "",
lastModified: "1727091669"
},
{
path: "/blogs/ddt/content-creator-guide-to-document-authoring-with-edge-delivery-services",
title: "A Content Creator’s Guide to Document Authoring with Edge Delivery Services - Part 1",
image: "/blogs/ddt/media_1288801a9d177d7c1918ae0ac4021c87d1940b97c.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through creating a page full of content that engages. An ongoing series for authors",
longdescription: "",
lastModified: "1719430788"
},
{
path: "/blogs/ddt/content-creator-guide-to-document-authoring-with-edge-delivery-services-part-2",
title: "A Content Creator’s Guide to Document Authoring with Edge Delivery Services - Part 2",
image: "/blogs/ddt/media_105e442bc7ae4a76650cab7f6bb47416a5e3ea389.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through creating a page full of content that engages. An ongoing series for authors",
longdescription: "",
lastModified: "1721906787"
},
{
path: "/blogs/ddt/content-creator-guide-to-document-authoring-with-edge-delivery-services-part-3",
title: "A Content Creator’s Guide to Document Authoring with Edge Delivery Services - Part 3",
image: "/blogs/ddt/media_17a147706e8f8e77691492099115c1645e10695a3.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through creating a page full of content that engages. An ongoing series for authors",
longdescription: "",
lastModified: "1725796192"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-0",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 0",
image: "/blogs/ddt/media_179bbd2158f9fa3a6a53bca48d55b8a13bf8e0dcc.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through Document Authoring with Adobe Edge Delivery Services. This is an introduction. An ongoing series for developers",
longdescription: "",
lastModified: "1725221604"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-1",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 1",
image: "/blogs/ddt/media_1d9d96b6449d96d62d720eff7f57510e5b4498d30.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through creating your blocks and amending the HTML provided by Edge Delivery Services to ensure that the page has the look and feel you need, with coding examples. An ongoing series for developers",
longdescription: "",
lastModified: "1725221651"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-10",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 10",
image: "/blogs/ddt/media_13a9b98de74fe78c8590f31129df2920433f1497f.png?width=1200&format=pjpg&optimize=medium",
description: "Using AI to provide Coding, Review, Documentation, and more",
longdescription: "",
lastModified: "1726943694"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-2",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 2",
image: "/blogs/ddt/media_19fa2d4025f84bfe045a403f243ea856581a8e274.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through creating your blocks and amending the HTML provided by Edge Delivery Services to ensure that the page has the look and feel you need, with coding examples. Part 2 covers fragments and has more  metadata detail",
longdescription: "",
lastModified: "1725221729"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-3",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 3",
image: "/blogs/ddt/media_1be6266d75f1dfe4f548567f03126997023212f31.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through the use of spreadsheets in Document Authoring with Edge Delivery Services.",
longdescription: "",
lastModified: "1725221795"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-4",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 4",
image: "/blogs/ddt/media_1ef226910ab0f6223b29f73f09a8a22480c557fe7.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through the use of Document Authoring with Edge Delivery Services, creating a SPA App.",
longdescription: "",
lastModified: "1725221843"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-5",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 5",
image: "/blogs/ddt/media_16570a6e0424a32e57fa85efdbbda3c2c3533e303.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through the use of Document Authoring with Edge Delivery Services. To create a React App that works with Edge Delivery Services",
longdescription: "",
lastModified: "1725221887"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-6",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 6",
image: "/blogs/ddt/media_1bcacddad23dbcdc82f54c37352ea624f06fc87ee.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through Document Authoring with Edge Delivery Services. Working with Json files and GitHub",
longdescription: "",
lastModified: "1725221935"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-7",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 7",
image: "/blogs/ddt/media_151efecfe0430ed1e37c7444ca8db86982c28d9a7.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through Document Authoring with Edge Delivery Services. This time, some useful components",
longdescription: "",
lastModified: "1725218398"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-8",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 8",
image: "/blogs/ddt/media_1819684cff75871771cc8ea01ae1a29fe48227b9c.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through Document Authoring with Edge Delivery Services. This time, using AI with Edge Delivery Services",
longdescription: "",
lastModified: "1725295745"
},
{
path: "/blogs/ddt/developer-guide-to-document-authoring-with-edge-delivery-services-part-9",
title: "Developer Guide to Document Authoring with Edge Delivery Services - Part 9",
image: "/blogs/ddt/media_1baaa119c1c4b6af4adccf00624b45b21303d1382.png?width=1200&format=pjpg&optimize=medium",
description: "This tutorial will guide you through Document Authoring with Edge Delivery Services. This time, set up and best practice",
longdescription: "",
lastModified: "1725539551"
},
{
path: "/blogs/ddt/eds-ai",
title: "AI-Powered Development",
image: "/blogs/ddt/media_1072b12c4580da4057cdc38d91cc2ecfb636072d6.png?width=1200&format=pjpg&optimize=medium",
description: "An article explaining a recent presentation",
longdescription: "",
lastModified: "1726862477"
},
{
path: "/blogs/ddt/five-things-to-do-do-in-york",
title: "Five things to do in York, England",
image: "/blogs/ddt/media_19853fc51f96a250e0853c1e5f204851aaeecc73a.png?width=1200&format=pjpg&optimize=medium",
description: "A number of posts describing what to do in York England",
longdescription: "",
lastModified: "1719926285"
},
{
path: "/blogs/ddt/hello-world",
title: "An explanatory web page",
image: "/blogs/ddt/media_145e13ea388af99109b4e34d2c57d40f5fc22d9c9.jpeg?width=1200&format=pjpg&optimize=medium",
description: "An elementary web page to help describe how Helix (Document Authoring for Edge Delivery Services) works",
longdescription: "",
lastModified: "1720210407"
},
{
path: "/blogs/ddt/imagecycle-demo",
title: "Imagecycle Demo",
image: "/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png",
description: "A demonstration of the Imagecycle block for Franklin",
longdescription: "",
lastModified: "1726859959"
},
{
path: "/blogs/ddt/llm-router",
title: "Using Cursor with Local LLM",
image: "",
description: "An article expkaing how to user Cursor with Local LLM. Includes Scripts",
longdescription: "",
lastModified: "1726059166"
},
{
path: "/blogs/ddt/local-development-with-aem-and-universal-editor",
title: "Local Development with AEM and Universal Editor",
image: "/blogs/ddt/media_13044e3d963766aca3b0d85134751b57012382df1.png?width=1200&format=pjpg&optimize=medium",
description: "Setting up a local development environment for AEM with the Universal Editor.",
longdescription: "",
lastModified: "1726512717"
},
{
path: "/blogs/ddt/revolutionising-aem-development-with-ai-a-live-demonstration",
title: "Revolutionising AEM Edge Delivery Services Development with AI",
image: "/default-meta-image.png?width=1200&format=pjpg&optimize=medium",
description: "Welcome, everyone. I'm Tom Cranstoun, an independent Adobe Experience Manager (AEM) Consultant. Today, I'm excited to showcase the transformative power of AI in web development, ...",
longdescription: "",
lastModified: "1725814653"
},
{
path: "/blogs/ddt/structuring-context-for-effective-ai-development",
title: "Structuring Context for Effective AI Development",
image: "/blogs/ddt/media_120a069aaacaa85ad73d3baf67b1df4573f5c0af0.png?width=1200&format=pjpg&optimize=medium",
description: "This post will explore the three-tiered structure for creating context in Cursor.ai, ensuring your AI assistant has all the information it needs to be a valuable coding partner.",
longdescription: "",
lastModified: "1726511084"
},
{
path: "/blogs/ddt/tester",
title: "AI-Generated Code",
image: "/blogs/ddt/media_107ec17c46e9e61d881724559b7c8ff7d5ff53982.png?width=1200&format=pjpg&optimize=medium",
description: "This is AI-generated code from a one-shot prompt",
longdescription: "",
lastModified: "1725539777"
},
{
path: "/blogs/ddt/untitled-document",
title: "Code Expander Block Demo",
image: "/blogs/ddt/media_1172203b3684b403431c8a40d8cf69c6aceccca69.png?width=1200&format=pjpg&optimize=medium",
description: "A demonstration of the Code Expander block functionality",
longdescription: "",
lastModified: "1727082476"
}
],
:type: "sheet"
}
