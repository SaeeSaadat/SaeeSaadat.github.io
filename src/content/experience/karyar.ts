import type { Experience } from '../../lib/types'

export default {
  order: 6,
  company: "Karyar",
  role: "Software Engineering Mentor (volunteer)",
  type: "Volunteer",
  // start/end are optional: add them here when you want dates shown
  badges: ["Mentoring", "Volunteering"],
  bullets: [
    {
      text: "Mentored new developers on their journey to becoming backend engineers, helping them with Python coding, databases and deployment.",
      tags: ["backend", "python", "devops", "leadership"],
      importance: "medium"
    },
    {
      text: "Volunteer work helping underprivileged people who couldn't attend good universities learn to become developers.",
      tags: ["leadership"],
      importance: "medium"
    }
  ]
} satisfies Experience
