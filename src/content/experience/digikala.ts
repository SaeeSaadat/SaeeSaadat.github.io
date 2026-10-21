import type { Experience } from '../../lib/types'

export default {
  order: 3,
  company: "Digikala",
  role: "Software Engineer",
  type: "Full-time",
  start: "January 2022",
  end: "December 2023",
  location: "Tehran, Iran",
  notes: "Digikala is the largest e-commerce platform in Iran.",
  bullets: [
    {
      text: "Worked on both the customer facing and vendor facing components of the platform.",
      tags: ["backend", "frontend", "fullstack"],
      importance: "high"
    },
    {
      text: "Maintained and implemented new features on a legacy PHP codebase with over a million lines of code, built with PHP, Symfony, MySQL, Redis and TypeScript.",
      tags: ["backend", "fullstack"],
      importance: "high"
    },
    {
      text: "Tech stack: PHP, Symfony, TypeScript, MySQL, CQRS architecture, Mono-repo VCS, Jenkins, Docker, Redis and Kafka.",
      tags: ["backend"],
      importance: "high"
    },
    {
      text: "Started the redesign process; co-designed the new architecture using Golang, Microservice architecture, Elasticsearch and MongoDB.",
      tags: ["backend"],
      importance: "high"
    },
    {
      text: "Maintained a high-traffic backend server for a service with over 50,000 daily active users.",
      tags: ["backend", "performance"],
      importance: "high"
    },
    {
      text: "Implemented a parallel delivery assignment and tracking service, resulting in 15% faster delivery time.",
      tags: ["backend", "performance"],
      importance: "high"
    },
    {
      text: "Found an issue with the existing delivery estimation service and took initiative to re-implement it using OSM with ALT instead of static caching, resulting in 10% fewer cancelled orders on rainy and snowy days and more accurate vendor suggestions.",
      tags: ["backend", "performance"],
      importance: "high"
    }
  ]
} satisfies Experience
