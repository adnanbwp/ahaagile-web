# Aha Agile Website MVP Product Requirements Document (PRD)

## 1. Goals and Background Context

### Goals

*   To generate an average of 5 qualified leads per month through the website within 6 months of launch.
*   To establish Aha Agile as a credible thought leader in the intelligent automation space for professional services firms.
*   To create durable web assets (case studies, articles) that support the sales cycle and build credibility.
*   To validate the market's need for bespoke intelligent workflow solutions.

### Background Context

This project is being undertaken to address a significant operational bottleneck observed in medium-sized professional services firms. These firms are losing substantial productivity (estimated at 25-35% of weekly capacity) to inefficient, email-driven administrative workflows. The goal of the Aha Agile website is to serve as a "digital consultant" and lead-generation engine. It will attract and engage business leaders by demonstrating a clear, quantifiable return on investment from implementing bespoke, intelligent automation solutions to solve these specific pain points.

The core strategy is to de-mystify AI and technology, focusing instead on tangible business outcomes. The website will use an evidence-based approach, centered around a detailed case study, to build trust and guide qualified prospects towards a consultation.

### Change Log

| Date       | Version | Description              | Author    |
| :--------- | :------ | :----------------------- | :-------- |
| 27/07/2025 | 1.0     | Initial PRD draft creation | John (PM) |

---

## 2. Requirements

### Functional Requirements

1.  **FR1**: The system shall present a Homepage that communicates the core value proposition and guides users to key content.
2.  **FR2**: The system shall present a Services page detailing the "Intelligent Workflow Automation" offering.
3.  **FR3**: The system shall present a single, in-depth Case Study page.
4.  **FR4**: The system shall present a Consultation & Contact page.
5.  **FR5**: The Consultation & Contact page shall feature an embedded Calendly scheduler for direct booking.
6.  **FR6**: The system shall include standard legal pages: a Privacy Policy and Terms of Service.
7.  **FR7**: The content for all pages (excluding the Calendly embed and legal policies) shall be sourced from local Markdown files within the project repository.

### Non-Functional Requirements

1.  **NFR1**: The website must be built using the Next.js framework and styled with Tailwind CSS.
2.  **NFR2**: The website must be deployed and hosted on the Vercel platform.
3.  **NFR3**: The architecture must be entirely serverless, with operational costs remaining within the free tiers of all chosen services (Vercel, Calendly).
4.  **NFR4**: The website must be responsive, providing an optimal viewing experience on common desktop and mobile screen sizes.
5.  **NFR5**: The website must be optimized for Search Engines (SEO), including the use of semantic HTML and appropriate meta tags.
6.  **NFR6**: The website must be secure, protecting any user data submitted through contact forms and following web security best practices.
7.  **NFR7**: The website must meet the performance goals defined in the MVP success criteria (Homepage bounce rate < 75%, Case Study average session > 90 seconds).

---

## 3. User Interface Design Goals

### Overall UX Vision

The user experience will be one of professional clarity and "calibrated enthusiasm." The design should feel like a conversation with a trusted, expert advisor: direct, insightful, and free of unnecessary jargon or clutter. The primary goal of the UI is to guide the user seamlessly from understanding their problem to seeing a credible solution and booking a consultation, all with minimal friction.

### Key Interaction Paradigms

*   **Guided Journey**: The user is never left wondering what to do next. Each page will have a clear, primary call-to-action (CTA) that logically guides them to the next step in the funnel.
*   **Minimalism & Focus**: The design will be clean and uncluttered. Each screen will focus on a single objective to avoid overwhelming the user.

### Core Screens and Views

1.  Homepage
2.  Services Page
3.  Case Study Page
4.  Consultation & Contact Page
5.  Privacy Policy / Terms of Service (simple text pages)

### Accessibility: WCAG AA

The website will be designed to meet WCAG 2.1 Level AA standards.

### Branding

The branding will be professional and minimalistic. The overall aesthetic will prioritize readability and trust.

### Target Device and Platforms: Web Responsive

The website must be fully responsive, providing an excellent, seamless experience on all common device types.

---

## 4. Technical Assumptions

### Repository Structure: Monorepo

A single repository ("monorepo") will be used to house all project code.

### Service Architecture

The architecture will be **entirely serverless**, leveraging on-demand **Vercel Functions** for any backend logic.

### Testing Requirements

The project will adhere to a "vertical slice" quality strategy from the outset.
*   **Unit Testing (Mandatory)**: All key components and utility functions MUST be accompanied by unit tests using **Jest** and **React Testing Library**.
*   **Integration Testing**: Key integrations, such as the Calendly embed and the contact form, will be tested.
*   **Automated End-to-End (E2E) Tests**: The critical user path will be covered by automated E2E tests.

### Additional Technical Assumptions and Requests

*   **Primary Framework**: MUST be built with Next.js (React).
*   **Styling**: MUST use Tailwind CSS.
*   **Content Source**: All non-legal page content MUST be sourced from local Markdown files.
*   **Deployment**: MUST be deployed on Vercel from a GitHub repository.
*   **Booking Integration**: MUST use Calendly for consultation booking.
*   **Development Workflow**: A feature-branch Git workflow MUST be followed. All automated checks MUST pass in the CI/CD pipeline before a PR can be merged to main.

---

## 5. Epic List

*   **Epic 1: MVP Website Foundation & Lead Generation Engine**
    *   **Goal**: To establish the complete technical foundation of the Aha Agile website, build all core MVP pages, and implement the primary lead generation funnel, resulting in a fully deployed, production-ready website that can begin capturing leads.

---

## 6. Epic 1: MVP Website Foundation & Lead Generation Engine

### Story 1.1: Project Foundation & Homepage Shell
**As a** Project Owner, **I want** the Next.js project initialized, connected to a GitHub repository, and deployed to Vercel, **so that** a foundational CI/CD pipeline is established and a live URL exists.
**Acceptance Criteria**:
1. A new Next.js project is created using the latest stable version.
2. The project is configured to use TypeScript and Tailwind CSS.
3. A new repository is created on GitHub and the project code is pushed.
4. The GitHub repository is connected to a new Vercel project.
5. A basic, unstyled "Homepage" page is created and displays the text "Aha Agile Coming Soon".
6. The initial deployment to Vercel succeeds, and the live Vercel URL correctly displays the homepage.
7. Jest and React Testing Library are installed and configured.

### Story 1.2: Core Layout, Styling, & Navigation
**As a** Visitor, **I want** to see a consistent header and footer on all pages, **so that** I can easily navigate the site and understand the brand.
**Acceptance Criteria**:
1. A sitewide Layout component is created that includes a header and a footer.
2. The header contains the "Aha Agile" name/logo and navigation links for "Services," "Case Study," and "Book a Consultation."
3. The footer contains links to the future Privacy Policy and Terms of Service pages, and a copyright notice.
4. The site's typography and primary color scheme are configured in `tailwind.config.js`.
5. The navigation links in the header are functional and correctly route to their respective (still empty) pages.
6. Unit tests are created for the Header and Footer components to ensure they render correctly.

### Story 1.3: Services Page Implementation
**As a** potential Client, **I want** to view a dedicated Services page, **so that** I can understand the specific solutions offered by Aha Agile.
**Acceptance Criteria**:
1. A new page is created at the `/services` route.
2. The page uses the sitewide Layout component.
3. All content for the page is rendered from a local Markdown file (`/content/services.md`).
4. The page is fully responsive and displays correctly on desktop and mobile devices.
5. The page includes a clear call-to-action button that links to the "Book a Consultation" page.

### Story 1.4: Case Study Page Implementation
**As a** potential Client, **I want** to read a detailed case study, **so that** I can see evidence of Aha Agile's expertise and the ROI they deliver.
**Acceptance Criteria**:
1. A new page is created at the `/case-study` route.
2. The page uses the sitewide Layout component.
3. All content for the page is rendered from a local Markdown file (`/content/case-study.md`).
4. The page is fully responsive and well-formatted for readability.
5. The page includes a clear call-to-action button that links to the "Book a Consultation" page.

### Story 1.5: Consultation Page & Calendly Integration
**As a** potential Client, **I want** to easily book a meeting directly on the website, **so that** I can take the next step with minimal friction.
**Acceptance Criteria**:
1. A new page is created at the `/book-a-consultation` route.
2. The page uses the sitewide Layout component.
3. The Calendly scheduling widget is successfully embedded and fully functional on the page.
4. A secondary, simple contact form (as a backup) is present on the page.
5. Submitting the contact form successfully triggers a Vercel serverless function that sends the submission details to a designated email address.
6. The serverless function is tested and confirmed to be working.

### Story 1.6: Finalize Homepage Content
**As a** Visitor, **I want** the Homepage to provide a clear summary and guide me to the most relevant content, **so that** I can quickly understand what Aha Agile does and find what I need.
**Acceptance Criteria**:
1. The placeholder content on the Homepage is replaced with final copy, rendered from `/content/homepage.md`.
2. The page content effectively communicates the core value proposition.
3. The page includes at least two clear calls-to-action: one linking to the Case Study page and one linking to the "Book a Consultation" page.
4. All links on the page are functional.

### Story 1.7: Legal Pages & Final Polish
**As a** Project Owner, **I want** to add the necessary legal pages and perform a final quality check, **so that** the site is professional, compliant, and ready for launch.
**Acceptance Criteria**:
1. A Privacy Policy page is created, sourcing its content from a Markdown file.
2. A Terms of Service page is created, sourcing its content from a Markdown file.
3. The footer links for these pages are correctly implemented.
4. A full site review is conducted to check for broken links, typographical errors, and responsive design issues on all pages.
5. The E2E test suite covering the main user funnel is passing.
6. The production domain (`ahaagile.com.au`) is correctly configured in Vercel.````