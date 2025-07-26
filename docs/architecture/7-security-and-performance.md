# 7. Security and Performance

### Security Requirements

*   **Contact Form**: The `/api/contact` endpoint must perform server-side validation on all incoming data. Environment variables (API keys) must be used and never exposed on the client side.
*   **Dependencies**: The project must use a tool like `npm audit` to check for security vulnerabilities in dependencies.
*   **HTTPS**: Vercel enforces HTTPS automatically.

### Performance Optimization

*   **Static Site Generation (SSG)**: All content pages (Homepage, Services, Case Study) will be statically generated at build time for maximum performance.
*   **Image Optimization**: All images will be optimized using the `<Image>` component from `next/image`.
*   **Minimal JavaScript**: The architecture avoids heavy client-side JavaScript, leading to fast load times.

---
