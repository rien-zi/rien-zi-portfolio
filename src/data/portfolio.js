// Public professional copy curated from the supplied background guide and project details.
export const profile = {
  name: "Renzil Rodrigues",
  handle: "rien-zi",
  location: "Bengaluru, India",
  headline: "Technical architect. Operational thinker. Hands-on builder.",
  intro: "I turn operational complexity into reliable software, automation and applied AI.",
  about: "My engineering work starts with understanding the people and processes behind a system. I connect business workflows, data, interfaces and infrastructure, then build the software that makes them work together.",
  perspective: "A background in training, content and operations shaped how I build: make complex things understandable, keep users close, and carry the work from problem definition through deployment.",
  email: "renzil.digispec@gmail.com",
  linkedin: "https://www.linkedin.com/in/rien-zi",
  github: "https://github.com/rien-zi",
};

export const career = [
  {
    date: "Apr 2026 — present", title: "Assistant Manager, Process Automation & Control Tower", company: "Swiggy",
    summary: "Engineering ownership with an additional remit for real-time operational monitoring and escalation handling.",
    contributions: ["Evaluate inefficient systems, broken pipelines and scattered data sources.", "Continue architecture, backend, automation and applied AI work alongside Control Tower responsibilities.", "Connect operational signals to actionable monitoring and workflow improvements."],
  },
  {
    date: "Nov 2024 — Apr 2026", title: "Lead Process Automation Engineer", company: "Swiggy",
    summary: "Expanded from individual automation work into architecture and end-to-end system ownership.",
    contributions: ["Design backend services, operational software and data-driven workflows.", "Integrate AI and retrieval into practical production systems.", "Own the lifecycle from system boundaries and data models to deployment and operational upkeep."],
  },
  {
    date: "Oct 2023 — Nov 2024", title: "Process Automation Engineer", company: "Swiggy",
    summary: "Built the software connecting operations, APIs, databases, analytics and AI/NLP.",
    contributions: ["Develop automation pipelines and backend integrations.", "Build operational interfaces, reporting and analytics workflows.", "Modernize existing systems while supporting ongoing production use."],
  },
  {
    date: "Oct 2022 — Oct 2023", title: "Assistant Team Lead, Training & Content", company: "Swiggy",
    summary: "The bridge from training and content leadership into software, automation and analytics.",
    contributions: ["Work across training, content and operational enablement.", "Translate recurring workflow problems into automation opportunities.", "Bring communication and knowledge-management experience into product and interface decisions."],
  },
  {
    date: "Sep 2020 — Oct 2022", title: "Senior Training Specialist", company: "Swiggy",
    summary: "Built a foundation in understanding users, processes and operational knowledge.",
    contributions: ["Support training, knowledge management and learning-platform workflows.", "Work on an LMS serving a reported 5,000+ users.", "Contribute to the Swiggy Genie rollout across approximately 55 cities."],
  },
];

export const projects = [
  {
    "id": "resolute",
    "name": "Resolute",
    "category": "Operational platform",
    "status": "Active platform",
    "role": "Architecture, automation & platform development",
    "description": "A customer-resolution platform that connects agent workflows, operational data, integrations and accountable automation.",
    "stack": [
      "PHP",
      "Node.js",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Snowflake"
    ],
    "highlights": [
      "8,000+ reported daily users",
      "Modernized PHP core"
    ],
    "architecture": "Agent interfaces → authorized workflows → APIs & middleware → operational data → automation & analytics",
    "contributions": [
      "Agent dashboards, customer-query workflows and knowledge-management tooling.",
      "Interaction auditing, email classification and human-reviewed RAG resolution.",
      "Alert deduplication, event relevance and CRM/ticketing integrations.",
      "Modernization of the existing PHP backend: query optimization, modular boundaries, secure payload handling and new APIs.",
      "An external middleware watcher for cross-domain ticketing limitations.",
      "Standardized communication across business lines."
    ],
    "outcome": "Self-reported scope: 8,000+ daily users, 150,000+ classified emails/day at approximately 98% accuracy, and 120,000+ screened interactions/day.",
    "next": "A single source of truth, cross-channel auditing, deterministic MIS analysis and workforce-management automation are in progress.",
    "problem": "Resolution work crossed scattered tools, data sources and communication workflows. The platform needed to bring those pieces together while existing production services remained in use.",
    "solution": "Connect the agent-facing workflow to authorized backend actions, operational data and automation. Treat PHP modernization as part of that platform evolution, improving established services incrementally instead of presenting it as a separate project.",
    "flow": [
      "Agent workspace",
      "Authorized action",
      "APIs & middleware",
      "Operational data",
      "Rules, retrieval & review",
      "Audit & reporting"
    ],
    "decisions": [
      {
        "title": "Modernize in place",
        "text": "Optimize queries, separate service boundaries and add secure APIs around the established PHP system while supporting ongoing use."
      },
      {
        "title": "Keep automation accountable",
        "text": "Combine deterministic rules, grounded retrieval and human review where a resolution needs judgment."
      },
      {
        "title": "Connect operational signals",
        "text": "Use deduplication, relevant alerts and integration tooling to bring actionable events into agent workflows."
      }
    ],
    "metrics": [
      {
        "value": "8,000+",
        "label": "Daily users · self-reported"
      },
      {
        "value": "150k+/day",
        "label": "Classified emails · self-reported"
      },
      {
        "value": "120k+/day",
        "label": "Screened interactions · self-reported"
      }
    ],
    "demo": "resolute"
  },
  {
    "id": "middleware",
    "name": "Middleware Integration",
    "category": "Backend systems",
    "status": "Shipped / active",
    "role": "Backend Lead",
    "description": "An event-driven workflow engine connecting SaaS, webhooks and internal tools through queues and reliable background execution.",
    "stack": [
      "Node.js",
      "TypeScript",
      "Express / Fastify",
      "PostgreSQL",
      "Redis / Bull",
      "Docker"
    ],
    "highlights": [
      "Retries & idempotency",
      "Independent workers"
    ],
    "architecture": "Webhook receivers → event queue → workers & handlers → relational state → notification dispatch",
    "contributions": [
      "Retries and idempotency checks for repeatable execution.",
      "Payload transformation across services with different contracts.",
      "Independent background handlers for fault-tolerant processing."
    ],
    "outcome": "Makes fragmented operational integrations maintainable, observable and resilient to failures.",
    "problem": "Operational tools expose different contracts and failure modes. Receiving an event is only the beginning: repeat deliveries, unavailable services and background work must be handled deliberately.",
    "solution": "Separate webhook receipt from processing through an event queue and independent workers. Transform payloads, keep state and apply retries and idempotency so a repeated request does not repeat its side effects.",
    "flow": [
      "Webhook receipt",
      "Event identity",
      "Queue",
      "Worker & transform",
      "Store state",
      "Dispatch"
    ],
    "decisions": [
      {
        "title": "Separate receipt from execution",
        "text": "Background workers isolate longer tasks from the incoming request and give processing an explicit lifecycle."
      },
      {
        "title": "Make repeats safe",
        "text": "Idempotency checks protect against duplicate events. Retry handling addresses transient failures."
      },
      {
        "title": "Adapt at the boundaries",
        "text": "Payload transformation connects services without assuming every service shares the same data contract."
      }
    ],
    "metrics": [
      {
        "value": "Event-driven",
        "label": "Workflow model"
      },
      {
        "value": "Idempotent",
        "label": "Repeat-event handling"
      },
      {
        "value": "Retryable",
        "label": "Background execution"
      }
    ],
    "demo": "middleware"
  },
  {
    "id": "document-intelligence",
    "name": "RAG & Document Intelligence",
    "category": "Applied AI",
    "status": "Shipped / production",
    "role": "Full-Stack Architect & Core Developer",
    "description": "Document ingestion and grounded retrieval that connect useful answers to inspectable source references.",
    "stack": [
      "Python",
      "FastAPI",
      "Pgvector / Qdrant",
      "OpenAI API",
      "React",
      "TypeScript"
    ],
    "highlights": [
      "Hybrid retrieval",
      "Answers with references"
    ],
    "architecture": "Document ingestion → chunking & embeddings → vector store → hybrid retrieval → context assembly → cited response",
    "contributions": [
      "Multi-format parsing and semantic indexing.",
      "Metadata-filtered retrieval and hybrid search.",
      "A conversational interface connecting answers to source references."
    ],
    "outcome": "Turns document collections into searchable knowledge while making the source of an answer visible.",
    "problem": "Unstructured documents contain useful knowledge, but readers need a way to find relevant material and inspect the evidence behind an answer.",
    "solution": "Parse and chunk documents, build semantic indexes, retrieve relevant context with hybrid search and metadata filters, and assemble responses that retain their source references.",
    "flow": [
      "Ingest",
      "Parse & chunk",
      "Embed & index",
      "Filter & retrieve",
      "Assemble context",
      "Answer & cite"
    ],
    "decisions": [
      {
        "title": "Preserve the source",
        "text": "Keep references attached to retrieved material so the interface can show where an answer came from."
      },
      {
        "title": "Combine retrieval signals",
        "text": "Hybrid search and metadata filters help narrow the material assembled into the response context."
      },
      {
        "title": "Make knowledge usable",
        "text": "The React/TypeScript interface connects a question, its retrieved evidence and its cited answer."
      }
    ],
    "metrics": [
      {
        "value": "Multi-format",
        "label": "Document ingestion"
      },
      {
        "value": "Hybrid",
        "label": "Retrieval strategy"
      },
      {
        "value": "Cited",
        "label": "Answer presentation"
      }
    ],
    "demo": "rag"
  },
  {
    "id": "campaign-management",
    "name": "Campaign Management",
    "category": "AI-assisted publishing",
    "status": "Deployed",
    "role": "Workflow design & engineering",
    "description": "A no-code campaign workflow that turns a brief into an HTML email, then supports review, revisions, preview tests and scheduling metadata.",
    "stack": [
      "AI API",
      "HTML email",
      "ImageKit / S3",
      "Content intent checks",
      "Campaign metadata"
    ],
    "highlights": [
      "350,000+ people reached · reported",
      "14% reported interaction uplift"
    ],
    "architecture": "Brief → intent check → AI HTML design → revision & review → test email → confirmation & metadata",
    "contributions": [
      "A no-code brief for campaign vibe and intended communication.",
      "AI API integration to design the content as an HTML template.",
      "Follow-up instructions and manual changes for small refinements.",
      "ImageKit integration over S3-backed image storage for publicly accessible assets.",
      "AI content-intent checks that block hurtful or unacceptable material under information-security boundaries and provide a reason.",
      "Test emails for the author and other reviewers before final confirmation.",
      "Campaign storage with audience, priority, schedule and related metadata."
    ],
    "outcome": "Self-reported since deployment: campaigns reaching 350,000+ people across multiple campaigns and a 14% increase in click or interaction rate.",
    "problem": "Stakeholders previously wrote the content and handed it to an engineer, who built the HTML template and scheduled it through scripts. Campaign creation depended on developer availability.",
    "solution": "Replace that recurring engineering handoff with a self-service workflow. Stakeholders describe the campaign, review an AI-designed HTML template, revise it through instructions or manual edits, test the email and confirm its delivery metadata.",
    "flow": [
      "Vibe & content brief",
      "AI intent check",
      "HTML design",
      "AI/manual revision",
      "Approval & test email",
      "Audience, priority & schedule"
    ],
    "decisions": [
      {
        "title": "Remove the recurring handoff",
        "text": "Give campaign owners the creation and revision controls that previously required an engineer to fashion a template and schedule a script."
      },
      {
        "title": "Review before delivery",
        "text": "Allow test emails to the author and other reviewers. Keep revisions available before final confirmation."
      },
      {
        "title": "Keep media and intent explicit",
        "text": "ImageKit provides public image access over S3-backed storage. AI checks evaluate content intent against the tool’s information-security boundaries and explain blocked requests."
      }
    ],
    "metrics": [
      {
        "value": "350,000+",
        "label": "People reached across campaigns · self-reported"
      },
      {
        "value": "14%",
        "label": "Click / interaction increase · self-reported"
      },
      {
        "value": "Self-service",
        "label": "Campaign creation workflow"
      }
    ],
    "demo": "campaign"
  }
];

export const impact = [
  { value: "150k+ / day", label: "Emails classified", detail: "Approximately 98% accuracy; approximately ₹7 Cr/year in associated savings." },
  { value: "120k+ / day", label: "Interactions screened", detail: "Audit Bot; approximately ₹4 Cr/year in projected savings or leakage reduction." },
  { value: "8,000+", label: "Daily platform users", detail: "Reported adoption of Resolute and related operational dashboards." },
  { value: "~13,000", label: "Email queries resolved", detail: "RAG-assisted resolution with human review and deterministic logic." },
  { value: "~₹3 Cr", label: "False-claim prevention", detail: "Reported value prevented or reduced through claim-prevention workflows." },
  { value: "+2.3% CSAT", label: "Communication improvements", detail: "Alongside a reported 6% reduction in escalations from incorrect communication." },
];

export const resolutionOutcomes = [
  { label: "First response", before: "Hours", after: "Minutes / seconds" },
  { label: "Average handling time", before: "10–15 minutes", after: "3–4 minutes" },
  { label: "Resolution turnaround", before: "24–48 hours", after: "4–8 hours" },
];

export const skills = [
  { name: "Backend & APIs", description: "Service boundaries, business logic and integrations that hold up in production.", tools: ["Node.js / TypeScript", "Python", "PHP", "Express / Fastify", "FastAPI / Flask", "REST & webhooks"] },
  { name: "Data & analytics", description: "Relational models, clean queries and operational visibility.", tools: ["PostgreSQL / MySQL", "MongoDB", "Snowflake", "Redis", "Power BI", "Looker Studio"] },
  { name: "Automation & integration", description: "Repeatable execution across fragmented tools and workflows.", tools: ["Queues & workers", "Redis / Bull", "Retries & idempotency", "Cron", "Event-driven workflows"] },
  { name: "Applied AI & retrieval", description: "AI inside reliable workflows, with structured outputs and grounded retrieval.", tools: ["RAG & hybrid search", "Pgvector / Qdrant", "OpenAI / Anthropic integrations", "Hugging Face", "Whisper", "Structured outputs"] },
  { name: "Interfaces", description: "Responsive, understandable interfaces connected to real system state.", tools: ["React / Next.js", "Vite", "TailwindCSS", "EJS", "GSAP", "Figma"] },
  { name: "Cloud & delivery", description: "Deployment, observation and upkeep are part of the engineering work.", tools: ["AWS EC2 / S3", "Docker", "PM2", "NGINX", "Certbot", "CI/CD & environment config"] },
  { name: "Identity & access", description: "Authentication and authorization designed as system boundaries.", tools: ["Sessions / JWT", "OTP", "OAuth", "SSO / SimpleSAML", "RBAC", "Protected routes & audit logging"] },
];

export const principles = [
  { title: "Start with the workflow", text: "Understand the business problem, the people involved and the edge cases before choosing the software boundaries." },
  { title: "Build for the whole lifecycle", text: "Data models, APIs, interfaces, deployment, observation and maintenance belong to the same engineering responsibility." },
  { title: "Keep AI accountable", text: "Use deterministic logic where it fits; add AI with structured outputs, grounded retrieval, evaluation and human review where needed." },
  { title: "Modernize with care", text: "Improve existing systems incrementally. Reliability and useful outcomes matter more than a fashionable rewrite." },
];

export const education = [
  { year: "2018", title: "Bachelor of Commerce", institution: "St. Aloysius College, Mangaluru" },
  { year: "2024", title: "Advanced Prompt Engineering Techniques", institution: "LinkedIn" },
  { year: "2024", title: "Career Essentials in Data Analysis", institution: "Microsoft" },
];
