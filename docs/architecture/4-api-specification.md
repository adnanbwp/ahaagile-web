# 4. API Specification

### Contact Form API Endpoint

A single API endpoint will be created to handle submissions from the fallback contact form.

*   **Endpoint**: `POST /api/contact`
*   **Description**: Receives contact form data, validates it, and sends an email notification.
*   **Request Body (JSON)**:
    ```json
    {
      "name": "string",
      "email": "string (email format)",
      "message": "string"
    }
    ```
*   **Success Response (`200 OK`)**:
    ```json
    {
      "status": "success",
      "message": "Your message has been sent successfully."
    }
    ```
*   **Error Response (`400 Bad Request`, `500 Internal Server Error`)**:
    ```json
    {
      "status": "error",
      "message": "A specific error message."
    }
    ```
*   **Implementation**: This will be a Vercel Serverless Function located at `/pages/api/contact.ts`.

---
