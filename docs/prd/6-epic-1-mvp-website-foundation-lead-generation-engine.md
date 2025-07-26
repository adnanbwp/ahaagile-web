# 6. Epic 1: MVP Website Foundation & Lead Generation Engine

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