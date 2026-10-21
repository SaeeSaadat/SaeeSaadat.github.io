import type { Experience } from '../../lib/types'

export default {
  order: 4,
  company: "Ostad Kar",
  role: "Software Engineer",
  type: "Full-time",
  start: "January 2021",
  end: "December 2022",
  location: "Tehran, Iran",
  bullets: [
    {
      text: "Maintained and developed features for the core backend components built with Python, Flask, Docker, PostgreSQL, Cassandra, Redis and RabbitMQ.",
      tags: ["backend", "devops"],
      importance: "high"
    },
    {
      text: "Responsible for creating an automated report system that integrates with 3rd party providers.",
      tags: ["backend", "devops"],
      importance: "medium"
    },
    {
      text: "Maintained the CI/CD process and developed skills in DevOps and software deployment.",
      tags: ["devops"],
      importance: "medium"
    }
  ]
} satisfies Experience
