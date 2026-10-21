import type { Experience } from '../../lib/types'

export default {
  order: 1,
  company: "PSI Software",
  role: "Working Student, Software Engineer",
  type: "Working Student",
  start: "July 2025",
  end: "Present",
  location: "Düsseldorf, Germany",
  bullets: [
    {
      text: "Worked with Java, Maven, Quarkus, PostgreSQL, Python, Google ADK, FastMCP, K8s, AngularJS, Google Cloud and Keycloak on an Enterprise multi-modular Java-based MES for the metals industry.",
      tags: ["backend", "java", "cloud"],
      importance: "high"
    },
    {
      text: "Created multiple temporal resampling algorithms for time-series data, resulting in up to 70% faster chart rendering.",
      tags: ["backend", "performance", "java"],
      importance: "high"
    },
    {
      text: "Led the technical development of the company's AI Agent & Chatbot initiative, architecting a multi-agent hierarchy and agentic workflows on Google ADK, and developing multiple tools and MCP servers to extend agent capabilities.",
      tags: ["ai", "leadership", "backend"],
      importance: "high"
    },
    {
      text: "Drove adoption of agentic technologies across the team by onboarding and mentoring developers and collaborating with domain experts to build specialised AI agents.",
      tags: ["ai", "leadership"],
      importance: "high"
    },
    {
      text: "Created a course for colleagues on how to build agent skills and co-created a skill registry where they share their agent skills.",
      tags: ["ai", "leadership", "devops"],
      importance: "medium"
    },
    {
      text: "Collaborated with security experts to resolve security issues in the codebase and in the everyday tools used by the team.",
      tags: ["security", "backend"],
      importance: "medium"
    },
    {
      text: "Completed Google Cloud app development coursework (Google Cloud Skills Boost) alongside hands-on GCP usage in production.",
      tags: ["cloud", "backend"],
      importance: "low"
    }
  ]
} satisfies Experience
