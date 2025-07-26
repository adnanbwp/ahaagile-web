# 4. Technical Assumptions

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
