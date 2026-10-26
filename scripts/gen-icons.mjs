// Generates src/lib/icons.ts from Simple Icons (CC0) and Devicon (MIT, for brands Simple Icons dropped).
// Usage: npm pack simple-icons devicon, untar each, then: node scripts/gen-icons.mjs <simple-icons>/icons <devicon>/icons src/lib/icons.ts
import { readFileSync, writeFileSync } from 'node:fs'
const [si, dev, out] = process.argv.slice(2)

// skill name (as written in skills.ts) -> 'slug' (Simple Icons) or 'dev:name' (Devicon plain)
const map = {
  Python: 'python', Java: 'dev:java', Kotlin: 'kotlin', Go: 'go', TypeScript: 'typescript', 'Node.js': 'nodedotjs',
  PHP: 'php', Swift: 'swift', 'Swift (iOS)': 'swift', FastAPI: 'fastapi', Quarkus: 'quarkus', QuarkusTest: 'quarkus', 'Spring Boot': 'springboot',
  Spring: 'spring', Flask: 'flask', Symfony: 'symfony', Gin: 'gin', AngularJS: 'angular', Flutter: 'flutter',
  PostgreSQL: 'postgresql', MySQL: 'mysql', Redis: 'redis', MongoDB: 'mongodb', 'MongoDB Atlas': 'mongodb',
  Cassandra: 'apachecassandra', Elasticsearch: 'elasticsearch', S3: 'dev:amazonwebservices', GraphQL: 'graphql',
  gRPC: 'dev:grpc', Kafka: 'apachekafka', RabbitMQ: 'rabbitmq', MQTT: 'mqtt', MCP: 'modelcontextprotocol',
  FastMCP: 'modelcontextprotocol', Docker: 'docker', Kubernetes: 'kubernetes', 'Google Cloud': 'googlecloud',
  Terraform: 'terraform', 'GitHub Actions': 'githubactions', 'GitLab CI/CD': 'gitlab', Jenkins: 'jenkins',
  'AWS (familiar)': 'dev:amazonwebservices', 'Azure (familiar)': 'dev:azure', 'Linux VMs & bare metal': 'linux',
  Keycloak: 'keycloak', OIDC: 'openid', pytest: 'pytest', JUnit: 'junit5', 'Kanban / Jira / GitHub Projects': 'jira',
  Git: 'git', 'Linux / macOS terminal': 'linux', NeoVim: 'neovim', 'JetBrains IDEs': 'jetbrains', LaTeX: 'latex',
  'Claude Code': 'claude', 'Google ADK': 'google', Antigravity: 'dev:antigravity', Postman: 'postman',
  pgvector: 'postgresql', RxSwift: 'reactivex', fastlane: 'fastlane',
}
// Devicon has no brand colour data, so these are set by hand
const devColor = { java: 'E76F00', amazonwebservices: 'FF9900', azure: '0078D4', grpc: '244B5A', antigravity: '4285F4' }
const siColor = Object.fromEntries(JSON.parse(readFileSync(`${si}/../data/simple-icons.json`, 'utf8')).map(i => [i.slug, i.hex]))

// Brand colour only when it reads on both the dark themes and latte; too dark or too light falls back to currentColor
const lum = hex => {
  const c = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const usable = hex => hex && lum(hex) > 0.08 && lum(hex) < 0.6 ? '#' + hex : ''

// No brand exists for these, so a hand-drawn glyph: a document with a check mark
const extra = {
  // Matter: symbol only, from the public-domain logo on Wikimedia Commons ("Logo of Matter connectivity standard.svg")
  Matter: ['0 -0.84 74.32 74.32', 'M65.715 32.905c-7.996 2.19-15.164 7.406-19.636 15.152s-5.407 16.568-3.306 24.587l7.835-4.526a23.9 23.9 0 0 1 1.105-11.836l18.309 10.569 4.303-2.487v-4.967L56.016 48.829a23.92 23.92 0 0 1 9.699-6.879zm-57.108 0v9.045a23.91 23.91 0 0 1 9.699 6.879L0 59.398v4.967l4.303 2.487 18.306-10.569c1.39 3.868 1.726 7.938 1.108 11.836l7.832 4.526c2.101-8.02 1.167-16.841-3.306-24.587A32.52 32.52 0 0 0 8.607 32.905zM37.161 0l-4.303 2.484v21.138c-4.046-.731-7.736-2.476-10.804-4.961l-7.838 4.522c5.895 5.83 14 9.429 22.946 9.429s17.051-3.599 22.946-9.429l-7.835-4.522a23.92 23.92 0 0 1-10.807 4.961V2.484z', ''],
  'Spec-driven development': ['0 0 24 24', 'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM6 4v16h12V8h-4V4zM8.3 13.3l1.4-1.4 1.8 1.8 3.8-3.8 1.4 1.4-5.2 5.2z', '#8839EF'],
}
const icons = {}
for (const [name, src] of Object.entries(map)) {
  const file = src.startsWith('dev:') ? `${dev}/${src.slice(4)}/${src.slice(4)}-plain.svg` : `${si}/${src}.svg`
  const svg = readFileSync(file, 'utf8')
  const vb = svg.match(/viewBox="([^"]+)"/)[1]
  const d = [...svg.matchAll(/\sd="([^"]+)"/g)].map(m => m[1]).join('')
  const hex = src.startsWith('dev:') ? devColor[src.slice(4)] : siColor[src]
  icons[name] = [vb, d, usable(hex)]
  if (!usable(hex)) console.log('mono:', name, hex)
}
writeFileSync(out, `// Generated: tech logos from Simple Icons (CC0) and Devicon (MIT), keyed by skill name in skills.ts.
// [viewBox, path, brand colour or '' for currentColor]. Skills without an entry are shown as text only.
// Regenerate with scripts/gen-icons.mjs.
export const icons: Record<string, [string, string, string]> = ${JSON.stringify({ ...icons, ...extra }, null, 1)}
`)
console.log(Object.keys(icons).length, 'icons')
