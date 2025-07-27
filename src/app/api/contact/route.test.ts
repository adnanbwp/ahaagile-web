/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST, GET, PUT, DELETE } from './route'

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn()
      }
    }))
  }
})

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  process.env = {
    ...originalEnv,
    RESEND_API_KEY: 'test-api-key',
    CONTACT_EMAIL: 'test@ahaagile.com.au',
    RATE_LIMIT_MAX_REQUESTS: '10',
    RATE_LIMIT_WINDOW_MS: '60000'
  }
})

afterEach(() => {
  process.env = originalEnv
})

// Helper function to create mock NextRequest
function createMockRequest(method: string, body?: any, headers?: Record<string, string>) {
  return {
    method,
    json: jest.fn().mockResolvedValue(body),
    ip: '127.0.0.1',
    headers: {
      get: jest.fn((key: string) => headers?.[key] || null)
    }
  } as unknown as NextRequest
}

describe('/api/contact', () => {
  let mockResendSend: jest.Mock

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Get the mock instance
    const { Resend } = require('resend')
    const mockResend = new Resend()
    mockResendSend = mockResend.emails.send
    mockResendSend.mockResolvedValue({ error: null, data: { id: 'test-id' } })
  })

  describe('POST /api/contact', () => {
    it('successfully sends email with valid data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      const request = createMockRequest('POST', validData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(200)
      expect(responseData.status).toBe('success')
      expect(responseData.message).toBe('Your message has been sent successfully.')
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'website@ahaagile.com.au',
          to: ['test@ahaagile.com.au'],
          subject: 'New Consultation Request from John Doe',
          replyTo: 'john.doe@example.com'
        })
      )
    })

    it('validates required fields', async () => {
      const invalidData = {
        name: '',
        email: '',
        message: ''
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toContain('Name is required')
      expect(responseData.message).toContain('Email is required')
      expect(responseData.message).toContain('Message is required')
    })

    it('validates email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Valid message content'
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toContain('Please provide a valid email address')
    })

    it('validates minimum length requirements', async () => {
      const invalidData = {
        name: 'A',
        email: 'valid@example.com',
        message: 'Short'
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toContain('Name must be at least 2 characters')
      expect(responseData.message).toContain('Message must be at least 10 characters')
    })

    it('validates maximum length requirements', async () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'valid@example.com',
        message: 'A'.repeat(5001)
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toContain('Name cannot exceed 100 characters')
      expect(responseData.message).toContain('Message cannot exceed 5000 characters')
    })

    it('handles invalid JSON', async () => {
      const request = {
        method: 'POST',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        ip: '127.0.0.1',
        headers: {
          get: jest.fn(() => null)
        }
      } as unknown as NextRequest

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Invalid JSON format in request body.')
    })

    it('handles missing RESEND_API_KEY', async () => {
      delete process.env.RESEND_API_KEY

      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      const request = createMockRequest('POST', validData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Email service is temporarily unavailable. Please try again later.')
    })

    it('handles Resend API errors', async () => {
      mockResendSend.mockResolvedValueOnce({ 
        error: { message: 'API error' }, 
        data: null 
      })

      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      const request = createMockRequest('POST', validData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Failed to send email. Please try again later.')
    })

    it('sanitizes input data', async () => {
      const maliciousData = {
        name: 'John<script>alert("xss")</script>Doe',
        email: 'john.doe@example.com',
        message: 'Message with <script>alert("xss")</script> content'
      }

      const request = createMockRequest('POST', maliciousData)
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'New Consultation Request from JohnscriptalertxssscriptDoe'
        })
      )
    })

    it('implements rate limiting', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      // Use a specific IP for this test
      const testIP = '10.0.0.100'

      // Make 10 requests (the limit)
      for (let i = 0; i < 10; i++) {
        const request = createMockRequest('POST', validData)
        request.ip = testIP
        const response = await POST(request)
        expect(response.status).toBe(200)
      }

      // 11th request should be rate limited
      const request = createMockRequest('POST', validData)
      request.ip = testIP
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(429)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Too many requests. Please try again later.')
    })

    it('handles different IP addresses for rate limiting', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      // Request from first IP
      const request1 = createMockRequest('POST', validData)
      request1.ip = '192.168.1.1'
      const response1 = await POST(request1)
      expect(response1.status).toBe(200)

      // Request from second IP should not be affected by first IP's rate limit
      const request2 = createMockRequest('POST', validData)
      request2.ip = '192.168.1.2'
      const response2 = await POST(request2)
      expect(response2.status).toBe(200)
    })

    it('handles unexpected errors gracefully', async () => {
      mockResendSend.mockRejectedValueOnce(new Error('Unexpected error'))

      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I would like to schedule a consultation.'
      }

      const request = createMockRequest('POST', validData)
      request.ip = '10.0.0.200' // Use unique IP to avoid rate limiting
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('An internal server error occurred. Please try again later.')
    })
  })

  describe('Other HTTP methods', () => {
    it('returns 405 for GET requests', async () => {
      const response = await GET()
      const responseData = await response.json()

      expect(response.status).toBe(405)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Method not allowed. Use POST to submit contact form.')
    })

    it('returns 405 for PUT requests', async () => {
      const response = await PUT()
      const responseData = await response.json()

      expect(response.status).toBe(405)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Method not allowed. Use POST to submit contact form.')
    })

    it('returns 405 for DELETE requests', async () => {
      const response = await DELETE()
      const responseData = await response.json()

      expect(response.status).toBe(405)
      expect(responseData.status).toBe('error')
      expect(responseData.message).toBe('Method not allowed. Use POST to submit contact form.')
    })
  })
})