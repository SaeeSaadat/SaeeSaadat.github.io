import type { Skills } from '../lib/types'

// track: which side of the focus dial a skill belongs to.
//   'ai' = AI agents, 'se' = software engineering, 'both' = always relevant, 'other' = shown but never featured
export default {
  // Headline skills: the big tiles at the top of skills. `where` is the proof, keep it short.
  core: [
    { name: 'Python', track: 'both', where: 'PSI, AYOT, Ostad Kar, survey platform' },
    { name: 'Java', track: 'se', where: 'Enterprise MES at PSI, independent Quarkus backend' },
    { name: 'System design', track: 'se', where: "Co-designed AYOT's product and Digikala's Go microservice redesign" },
    { name: 'PostgreSQL', track: 'se', where: 'PSI, AYOT, Ostad Kar, independent backend' },
    { name: 'Kubernetes & Docker', track: 'se', where: 'PSI, AYOT, Digikala, Ostad Kar' },
    { name: 'Google Cloud & Terraform', track: 'se', where: 'Dev and prod environments fully as code' },
    { name: 'Kafka, RabbitMQ, Redis', track: 'se', where: 'High-traffic services at Digikala and Ostad Kar' },
    { name: 'Security & auth', track: 'se', where: 'Custom auth, Keycloak, OIDC, device encryption' },
    { name: 'Multi-agent systems', track: 'ai', where: "Architected PSI's multi-agent hierarchy" },
    { name: 'Google ADK', track: 'ai', where: 'Agentic workflows in production, Google certified' },
    { name: 'MCP servers', track: 'ai', where: 'Built tools and MCP servers with FastMCP' },
    { name: 'Agentic coding', track: 'ai', where: 'Claude Code, Gemini CLI; taught a course on agent skills' },
    { name: 'RAG & embeddings', track: 'ai', where: 'Vector databases, Pinecone, OpenAI API' },
  ],
  groups: [
    { name: 'AI agents', track: 'ai', items: ['Google ADK', 'FastMCP', 'Multi-agent system design', 'Agentic workflow orchestration', 'RAG', 'Vector databases', 'Embeddings', 'OpenAI API', 'Prompt engineering'] },
    { name: 'AI-assisted development', track: 'ai', items: ['Claude Code', 'Gemini CLI', 'Antigravity', 'Cursor', 'GitHub Copilot', 'Human-in-the-loop development', 'Spec-driven development', 'Prompt engineering for code'] },
    { name: 'Languages', track: 'both', items: ['Python', 'Java', 'Kotlin', 'Go', 'TypeScript', 'Node.js', 'PHP', 'Swift'] },
    { name: 'Frameworks', track: 'se', items: ['FastAPI', 'Quarkus', 'Spring Boot', 'Spring', 'Flask', 'Symfony', 'Gin', 'AngularJS', 'Flutter'] },
    { name: 'Databases & storage', track: 'se', items: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'Cassandra', 'Elasticsearch', 'S3', 'Pinecone', 'MongoDB Atlas'] },
    { name: 'APIs & messaging', track: 'se', items: ['REST', 'gRPC', 'GraphQL', 'WebSockets', 'Kafka', 'RabbitMQ', 'MQTT', 'Matter', 'MCP'] },
    { name: 'Cloud & DevOps', track: 'se', items: ['Docker', 'Kubernetes', 'Google Cloud', 'Terraform', 'GitHub Actions', 'GitLab CI/CD', 'Jenkins', 'AWS (familiar)', 'Azure (familiar)', 'Linux VMs & bare metal', 'Microservices'] },
    { name: 'Security', track: 'se', items: ['Secure software design', 'Zero-trust principles', 'Encryption', 'Keycloak', 'OIDC', 'RBAC', 'ReBAC', 'Software supply chain'] },
    { name: 'Testing', track: 'se', items: ['pytest', 'JUnit', 'Mockito', 'QuarkusTest', 'TDD / BDD'] },
    { name: 'Process & product', track: 'both', items: ['Agile (Scrum, XP, DAD)', 'Requirement engineering', 'Risk analysis', 'Spec-driven development', 'Kanban / Jira / GitHub Projects'] },
    { name: 'Tools', track: 'both', items: ['Git', 'Linux / macOS terminal', 'NeoVim', 'JetBrains IDEs', 'LaTeX'] },
    { name: 'Mobile', track: 'other', items: ['Swift (iOS)', 'RxSwift', 'Alamofire', 'fastlane', 'Storyboards', 'Flutter'] },
  ],
  // Lenses: the clickable categories on the skills page. A lens lights up its skills and pulls
  // matching bullets from experience/projects as proof (by keyword, case-insensitive, start of word, or by tag).
  lenses: [
    {
      id: 'ai', name: 'AI agents', focus: 1,
      blurb: 'Multi-agent systems, MCP servers and agentic workflows, built in production at PSI.',
      skills: ['Multi-agent systems', 'Google ADK', 'MCP servers', 'Agentic coding', 'RAG & embeddings', 'Python',
        'FastMCP', 'Multi-agent system design', 'Agentic workflow orchestration', 'RAG', 'Vector databases', 'Embeddings',
        'OpenAI API', 'Prompt engineering', 'Claude Code', 'Gemini CLI', 'Antigravity', 'Cursor', 'GitHub Copilot',
        'Human-in-the-loop development', 'Spec-driven development', 'Prompt engineering for code', 'MCP', 'Pinecone'],
      keywords: ['agent', 'ADK', 'MCP', 'Claude Code'],
      tags: ['ai'],
    },
    {
      id: 'java', name: 'Java backend', focus: 0,
      blurb: 'Enterprise Java at PSI and a production Quarkus backend I architected end to end.',
      skills: ['Java', 'System design', 'PostgreSQL', 'Security & auth', 'Kotlin', 'Quarkus', 'Spring Boot', 'Spring',
        'JUnit', 'Mockito', 'QuarkusTest', 'TDD / BDD', 'Redis', 'S3', 'Keycloak', 'REST'],
      keywords: ['Java', 'Quarkus', 'Spring', 'Kotlin', 'Domain-Driven'],
      tags: ['java'],
    },
    {
      id: 'python', name: 'Python backend', focus: 0.2,
      blurb: 'FastAPI and Flask services, from a startup product to real-time research software.',
      skills: ['Python', 'PostgreSQL', 'Kafka, RabbitMQ, Redis', 'FastAPI', 'Flask', 'pytest', 'TDD / BDD', 'Redis',
        'Cassandra', 'RabbitMQ', 'WebSockets', 'MQTT', 'REST'],
      keywords: ['Python', 'FastAPI', 'Flask'],
      tags: ['python'],
    },
    {
      id: 'infra', name: 'Infrastructure & cloud', focus: 0,
      blurb: 'Kubernetes, Docker, Google Cloud with Terraform, and the CI/CD around them.',
      skills: ['Kubernetes & Docker', 'Google Cloud & Terraform', 'Docker', 'Kubernetes', 'Google Cloud', 'Terraform',
        'GitHub Actions', 'GitLab CI/CD', 'Jenkins', 'AWS (familiar)', 'Azure (familiar)', 'Linux VMs & bare metal',
        'Microservices', 'S3', 'Linux / macOS terminal'],
      keywords: ['K8s', 'Kubernetes', 'Docker', 'Google Cloud', 'GCP', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'VMs'],
    },
    {
      id: 'data', name: 'Distributed systems & data', focus: 0,
      blurb: 'High-traffic services, messaging and the databases behind them.',
      skills: ['System design', 'PostgreSQL', 'Kafka, RabbitMQ, Redis', 'Kafka', 'RabbitMQ', 'Redis', 'MongoDB', 'Cassandra',
        'Elasticsearch', 'MySQL', 'gRPC', 'Microservices', 'MQTT', 'WebSockets', 'GraphQL'],
      keywords: ['Kafka', 'RabbitMQ', 'Redis', 'Microservice', 'daily active', 'Elasticsearch', 'Cassandra', 'CQRS', 'time-series', 'real-time'],
      tags: ['performance'],
    },
    {
      id: 'security', name: 'Security', focus: 0.2,
      blurb: 'Authentication, authorisation and device encryption built from scratch; security fixes with experts at PSI.',
      skills: ['Security & auth', 'Secure software design', 'Zero-trust principles', 'Encryption', 'Keycloak', 'OIDC',
        'RBAC', 'ReBAC', 'Software supply chain'],
      keywords: ['secur', 'auth', 'encryption', 'Keycloak'],
    },
    {
      id: 'lead', name: 'Leadership', focus: 0.5,
      blurb: 'Founded a startup, led a team of 10, and drove AI adoption across a team.',
      skills: ['System design', 'Agile (Scrum, XP, DAD)', 'Requirement engineering', 'Risk analysis',
        'Spec-driven development', 'Kanban / Jira / GitHub Projects'],
      keywords: ['led', 'lead', 'mentor', 'founded', 'recruited', 'onboarding', 'a course', 'stakeholder'],
      tags: ['leadership'],
    },
  ],
} satisfies Skills
