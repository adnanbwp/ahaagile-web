# 9. Coding Standards

*   **Type Sharing**: Not applicable for this simple architecture, but as the project grows, shared types should be defined in a `src/types` directory.
*   **API Calls**: All client-side API calls to our own backend (e.g., the contact form) will be made using the native `fetch` API.
*   **Environment Variables**: Server-side environment variables must only be accessed in server components or API routes, never exposed to the client.

---
