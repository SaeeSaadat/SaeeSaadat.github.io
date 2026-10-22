import type { Project } from '../../lib/types'

export default {
  order: 3,
  name: "Personal IoT Platform",
  tech: "MQTT, Python, Arduino, Home Assistant",
  period: "2023-Present",
  tags: ["iot", "backend", "security", "python"],
  badges: ["IoT", "Security", "Python"],
  bullets: [
    {
      text: "Built a personal MQTT-based IoT platform connecting custom Arduino gadgets over Wi-Fi, with a Python backend managing device state and events.",
      tags: ["iot", "backend", "python"],
      importance: "medium"
    },
    {
      text: "Implemented asymmetric encryption and device authentication from scratch to secure all device communication.",
      tags: ["iot", "security"],
      importance: "medium"
    },
    {
      text: "Integrated with Home Assistant-compatible devices for a unified smart home control layer across custom and commercial hardware.",
      tags: ["iot"],
      importance: "low"
    }
  ]
} satisfies Project
