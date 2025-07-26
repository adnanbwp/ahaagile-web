# 5. Unified Project Structure

The project will follow the standard Next.js `app` router directory structure.

```plaintext
/
├── .github/                # CI/CD workflows
│   └── workflows/
│       └── ci.yaml
├── .vscode/                # VSCode settings
├── content/                # Markdown content files
│   ├── case-study.md
│   ├── homepage.md
│   └── services.md
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (legal)/        # Route group for legal pages
│   │   │   ├── privacy-policy/
│   │   │   │   └── page.mdx
│   │   │   └── terms-of-service/
│   │   │       └── page.mdx
│   │   ├── api/            # API routes
│   │   │   └── contact/
│   │   │       └── route.ts
│   │   ├── case-study/     # Case study page
│   │   │   └── page.tsx
│   │   ├── services/       # Services page
│   │   │   └── page.tsx
│   │   ├── book-a-consultation/ # Consultation page
│   │   │   └── page.tsx
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/           # Reusable React components
│   │   ├── ui/             # Core UI elements (Button, Card)
│   │   └── layout/         # Layout components (Header, Footer)
│   ├── lib/                  # Libraries and utilities
│   │   └── markdown.ts     # Markdown rendering utility
│   └── styles/               # Global styles
│       └── globals.css
├── tests/                  # Test files
│   └── e2e/                # Playwright E2E tests
├── .eslintrc.json
├── .gitignore
├── jest.config.js
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---
