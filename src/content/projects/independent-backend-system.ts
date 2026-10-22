import type { Project } from '../../lib/types'

export default {
  order: 1,
  name: "Independent Backend System",
  tech: "Java, Quarkus, GCP, Terraform, PostgreSQL, Redis, S3",
  period: "2025-2026",
  tags: ["backend", "java", "cloud", "devops", "leadership"],
  badges: ["Entrepreneurship", "Java", "Tech Lead", "Infrastructure as Code"],
  bullets: [
    {
      text: "Sole architect and tech lead on a production-grade Java/Quarkus backend with Domain-Driven Design, translating a non-technical stakeholder's use cases into user stories through full requirement engineering.",
      tags: ["backend", "java", "leadership"],
      importance: "high"
    },
    {
      text: "Built custom authentication and authorisation from scratch, full REST API layer, domain layer, async/scheduled task management, Redis caching, and S3-based media storage.",
      tags: ["backend", "java", "security"],
      importance: "high"
    },
    {
      text: "Deployed and managed dev and production environments on GCP with all infrastructure as code using Terraform.",
      tags: ["cloud", "devops"],
      importance: "high"
    },
    {
      text: "Acted as tech lead, coordinating a designer and front-end developer and owning the full technical direction.",
      tags: ["leadership"],
      importance: "high"
    },
    {
      text: "Applied agentic coding workflows (Claude Code) throughout, directing AI agents for implementation while retaining full architectural ownership and code-quality control.",
      tags: ["ai"],
      importance: "medium"
    }
  ]
} satisfies Project
