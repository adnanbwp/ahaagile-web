# 8. Testing Strategy

*   **Unit Tests**: Key UI components (e.g., Header, Button) and utility functions will be unit-tested using **Jest** and **React Testing Library**. Tests will be located alongside the component files (e.g., `Button.test.tsx`).
*   **Integration Tests**: The `/api/contact` serverless function will be tested to ensure it correctly handles valid and invalid requests.
*   **E2E Tests**: The primary user funnel (Homepage -> Case Study -> Consultation Page) will be tested using **Playwright** to ensure the core business goal is always functional.

---
