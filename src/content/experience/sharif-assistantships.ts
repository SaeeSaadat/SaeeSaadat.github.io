import type { Experience } from '../../lib/types'

export default {
  order: 7,
  company: "Sharif University of Technology",
  role: "Teaching & Research Assistant",
  type: "Part-time",
  location: "Tehran, Iran",
  badges: ["Teaching", "Research", "NLP"],
  bullets: [
    {
      text: "Teaching Assistant for Database Design, Simulation, Natural Language Processing and Computer Networks.",
      tags: ["backend", "ai", "leadership"],
      importance: "medium"
    },
    {
      text: "Research Assistant at the Natural Language Processing and Digital Humanities Lab.",
      tags: ["ai", "research"],
      importance: "medium"
    },
    {
      text: "Research Assistant at the Sharif IoT Research Center.",
      tags: ["iot", "research"],
      importance: "low"
    }
  ]
} satisfies Experience
