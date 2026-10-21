import type { Experience } from '../../lib/types'

export default {
  order: 5,
  company: "Farazpardazan",
  role: "iOS App Developer",
  type: "Full-time",
  start: "February 2020",
  end: "January 2021",
  location: "Tehran, Iran",
  bullets: [
    {
      text: "Started as a junior iOS developer with no prior Swift or frontend experience; after 3 months of training, joined the team building Eghtesad Novin Bank's mobile banking iOS application.",
      tags: ["mobile", "ios", "frontend"],
      importance: "high"
    },
    {
      text: "Tech stack: Swift (iOS 10+), Storyboards, Alamofire, fastlane and RxSwift.",
      tags: ["mobile", "ios", "frontend"],
      importance: "high"
    },
    {
      text: "After 7 months, moved to the Razi Insurance iOS application with full ownership of the app and no senior developer to assist or supervise, while studying in my 4th semester at Sharif University.",
      tags: ["mobile", "ios", "leadership"],
      importance: "high"
    }
  ]
} satisfies Experience
