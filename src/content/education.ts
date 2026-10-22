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
      end: "February 2024",
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
  ],
  publications: [
    {
      title: "HarfoSokhan: A Comprehensive Parallel Dataset for Transitions between Persian Colloquial and Formal Variations",
      authors: "Hamid Jahad Sarvestani, Vida Ramezanian, Saee Saadat, Neda Taghizadeh Serajeh, Maryam Sadat Razavi Taheri, Shohreh Kasaei, MohammadAmin Fazli, Ehsaneddin Asgari",
      venue: "EACL 2026 (Long Papers)",
      year: "2026",
      url: "https://aclanthology.org/2026.eacl-long.346/",
      award: "Resource Paper Award",
      summary: "A 6M-sentence-pair dataset for converting colloquial Persian to formal Persian; a GPT-2 model trained on it beat GPT-3.5-turbo at the style transfer in human evaluation."
    }
  ]
} satisfies Education
