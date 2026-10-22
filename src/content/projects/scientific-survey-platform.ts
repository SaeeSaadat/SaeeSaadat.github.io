import type { Project } from '../../lib/types'

export default {
  order: 2,
  name: "Scientific Survey Platform",
  tech: "FastAPI, Python, Yjs, WebSockets",
  period: "2024-Present",
  tags: ["backend", "python", "research"],
  badges: ["Python", "Real-time", "Research"],
  bullets: [
    {
      text: "Active contributor to a real-time scientific survey platform for the Behavioral Security Research Group at the University of Bonn.",
      tags: ["backend", "python", "research"],
      importance: "medium"
    },
    {
      text: "Integrated Yjs for live multi-user collaboration, enabling conflict-free simultaneous editing by multiple researchers.",
      tags: ["backend", "python"],
      importance: "medium"
    },
    {
      text: "Contributed to API design, data flow, and real-time synchronisation logic using FastAPI.",
      tags: ["backend", "python"],
      importance: "medium"
    }
  ]
} satisfies Project
