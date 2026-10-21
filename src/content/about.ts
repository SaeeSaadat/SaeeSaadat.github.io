import type { About } from '../lib/types'

export default {
  name: "Saee Saadat",
  title: "Software Engineer",
  location: "Bonn, Germany",
  linkedin: "https://linkedin.com/in/saeesaadat",
  github: "https://github.com/saeesaadat",
  email: "me@saee.codes",
  summary: {
    default: "Mid-Level Software Engineer specialising in reliable backend systems, with Python and Java as primary languages. System Design, Database Design, and Secure Software Engineering are my technical strong suits. A proactive team member who loves brainstorming ways to improve both the product and internal workflows — constantly learning and pushing to grow, with the goal of bringing Senior-level technical depth and mentorship to everything I do.\n",
    ai_focused: "Software Engineer with a strong backend foundation and a growing specialisation in agentic AI systems. I have built multi-agent hierarchies, MCP servers, and agentic workflows in production at PSI Software, and I am deeply interested in the tooling and infrastructure layer that makes AI systems reliable and useful.\n",
    software_and_ai: "Software Engineer with working knowledge of every part of a system (backend, frontend, databases, infrastructure, security and AI) and a deeper focus on backend, where my expertise is Java and Python. I also work with Go, Kotlin, Node.js and PHP. I have deployed software on cloud environments such as Google Cloud (with Terraform) as well as on self-managed systems and VMs using Docker and Kubernetes. On the AI side I architect multi-agent systems and MCP servers with Google ADK, and I have extensive hands-on experience with Gemini CLI, Antigravity and Claude Code, following a spec-driven development approach.\n",
    startup_focused: "Software Engineer and former startup founder with experience across the full spectrum — from writing production code to leading a team of 10 engineers and shipping a product from zero. I bring both technical depth and product thinking to everything I build.\n"
  },
  languages: [
    {
      language: "English",
      cefr: "C2",
      label: "Fluent"
    },
    {
      language: "German",
      cefr: "A2",
      label: "Basic (actively improving)"
    },
    {
      language: "Persian",
      cefr: "Native",
      label: "Native language"
    }
  ],
  interests: {
    professional: ["Software Engineering & system design", "AI / Agentic Systems", "Internet of Things", "Cloud Computing", "Software Security & zero-trust architectures", "Automation and developer tooling"],
    personal: ["IoT passion projects with Arduino", "Padel", "Gym", "Soccer", "Table tennis", "Cooking", "Tech news"]
  }
} satisfies About
