import type { Experience } from '../../lib/types'

export default {
  order: 2,
  company: "AYOT",
  role: "Founder, Software Engineer",
  type: "Founder / Full-time",
  start: "January 2021",
  end: "December 2024",
  location: "Sharif Innovation Park, Tehran",
  bullets: [
    {
      text: "Founded an IoT & smart home startup at Sharif Innovation Park; following a passion for entrepreneurship and connected devices.",
      tags: ["startup", "iot", "leadership"],
      importance: "medium"
    },
    {
      text: "Recruited and led a team of 10 professional engineers.",
      tags: ["leadership", "startup"],
      importance: "high"
    },
    {
      text: "Co-designed the MVP and the final product's architecture.",
      tags: ["startup", "backend", "leadership"],
      importance: "high"
    },
    {
      text: "Tech stack: Python, FastAPI, PostgreSQL, Redis, K8s, Flutter, MQTT and Matter, deployed on VMs managed by a cloud provider.",
      tags: ["backend", "iot", "startup", "cloud"],
      importance: "high"
    },
    {
      text: "Applied Test-driven development (100% test coverage), a lean agile methodology, and full project management (backlog, Kanban, GitHub Actions).",
      tags: ["devops", "backend", "startup"],
      importance: "medium"
    },
    {
      text: "Defined use-cases and user stories, performed risk analysis, managed the backlog and Kanban board, and created complete documentation for all implemented software.",
      tags: ["startup", "leadership"],
      importance: "medium"
    },
    {
      text: "Grew rapidly as a leader, product owner, and engineer through courses, mentorship, and hands-on experience with domain experts.",
      tags: ["leadership", "startup"],
      importance: "low"
    }
  ]
} satisfies Experience
