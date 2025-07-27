import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Rate limiting in-memory store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Configuration
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10')
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') // 1 minute
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@ahaagile.com.au'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  message: string
}

// Input validation helper
function validateContactData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string')
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  } else if (data.name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters')
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string')
  } else {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(data.email.trim())) {
      errors.push('Please provide a valid email address')
    }
  }

  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required and must be a string')
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  } else if (data.message.trim().length > 5000) {
    errors.push('Message cannot exceed 5000 characters')
  }

  return { isValid: errors.length === 0, errors }
}

// Input sanitization helper
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 5000) // Limit length
}

// Rate limiting helper
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = rateLimitStore.get(clientIP)

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit data
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    })
    return true
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  // Increment count
  clientData.count++
  rateLimitStore.set(clientIP, clientData)
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      )
    }

    // Parse request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid JSON format in request body.'
        },
        { status: 400 }
      )
    }

    // Validate input data
    const { isValid, errors } = validateContactData(body)
    if (!isValid) {
      return NextResponse.json(
        {
          status: 'error',
          message: errors.join(' ')
        },
        { status: 400 }
      )
    }

    // Sanitize input data
    const contactData: ContactFormData = {
      name: sanitizeInput(body.name),
      email: body.email.trim().toLowerCase(),
      message: sanitizeInput(body.message)
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set')
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email service is temporarily unavailable. Please try again later.'
        },
        { status: 500 }
      )
    }

    // Prepare email content
    const emailSubject = `New Consultation Request from ${contactData.name}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Consultation Request
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This message was sent from the Aha Agile website consultation form.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    const emailText = `
New Consultation Request

Name: ${contactData.name}
Email: ${contactData.email}

Message:
${contactData.message}

Submitted at: ${new Date().toLocaleString()}
    `

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'website@ahaagile.com.au',
      to: [CONTACT_EMAIL],
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      reply_to: contactData.email
    })

    if (emailResult && emailResult.error) {
      console.error('Resend API error:', emailResult.error)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to send email. Please try again later.'
        },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        status: 'success',
        message: 'Your message has been sent successfully.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form API error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'An internal server error occurred. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      status: 'error',
      message: 'Method not allowed. Use POST to submit contact form.'
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      status: 'error',
      message: 'Method not allowed. Use POST to submit contact form.'
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      status: 'error',
      message: 'Method not allowed. Use POST to submit contact form.'
    },
    { status: 405 }
  )
}