import type { Education } from '../lib/types'

export default {
  degrees: [
    {
      institution: "University of Bonn",
      degree: "M.Sc. in Computer Science",
      start: "October 2024",
      end: "September 2027",
      location: "Bonn, Germany",
      gpa: "1.6 (German scale, 1.0 = best)"
    },
    {
      institution: "Sharif University of Technology",
      degree: "B.Sc. in Computer Engineering",
      start: "September 2018",
      end: "January 2024",
      location: "Tehran, Iran",
      gpa: "1.5 (German scale, 1.0 = best)",
      notes: "The top engineering university in Iran. Chose the 5-year path which included two co-op semesters for full-time work alongside studies. Took an extra semester to focus on the startup and entrepreneurial coursework.\n"
    }
  ],
  certifications: [
    {
      name: "Engineer AI Agents with Agent Development Kit (ADK)",
      issuer: "Google Cloud",
      date: "May 2026",
      url: "https://www.credly.com/org/google-cloud"
    }
  ]
} satisfies Education
