import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookConsultationPage from './page'

// Mock the components
jest.mock('@/components/ui/CalendlyWidget', () => {
  return function MockCalendlyWidget({ className }: { className?: string }) {
    return (
      <div className={className} data-testid="calendly-widget">
        <h2>Schedule Your Consultation</h2>
        <div>Mock Calendly Widget</div>
      </div>
    )
  }
})

// Mock fetch for the contact form
global.fetch = jest.fn()

describe('BookConsultationPage', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders the page with correct title and description', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByRole('heading', { name: /book your consultation/i })).toBeInTheDocument()
    expect(screen.getByText(/ready to transform your workflows/i)).toBeInTheDocument()
  })

  it('renders the benefits section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/what to expect in your consultation/i)).toBeInTheDocument()
    expect(screen.getByText(/assessment:/i)).toBeInTheDocument()
    expect(screen.getByText(/strategy:/i)).toBeInTheDocument()
    expect(screen.getByText(/next steps:/i)).toBeInTheDocument()
  })

  it('renders the Calendly widget', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByTestId('calendly-widget')).toBeInTheDocument()
    expect(screen.getByText(/schedule your consultation/i)).toBeInTheDocument()
  })

  it('renders the contact form', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/alternative contact form/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message \*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('validates contact form fields', async () => {
    const user = userEvent.setup()
    render(<BookConsultationPage />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    // Try to submit empty form
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    // Fill in valid data for other fields so only email validation fails
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'invalid-email')
    await user.type(messageInput, 'This is a valid message with enough characters')
    
    // Trigger validation by blurring the email field
    await user.click(emailInput)
    await user.tab()
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('validates minimum length requirements', async () => {
    const user = userEvent.setup()
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'A')
    await user.type(messageInput, 'Short')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('submits contact form successfully', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Your message has been sent successfully.'
      })
    })
    
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(messageInput, 'I would like to schedule a consultation.')
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'I would like to schedule a consultation.'
        })
      })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/your message has been sent successfully/i)).toBeInTheDocument()
    })
  })

  it('handles contact form submission errors', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        status: 'error',
        message: 'Server error occurred.'
      })
    })
    
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(messageInput, 'I would like to schedule a consultation.')
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument()
    })
  })

  it('handles network errors', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(messageInput, 'I would like to schedule a consultation.')
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/network error.*please check your connection/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    ;(fetch as jest.Mock).mockReturnValueOnce(promise)
    
    render(<BookConsultationPage />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(messageInput, 'I would like to schedule a consultation.')
    
    await user.click(submitButton)
    
    expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Your message has been sent successfully.'
      })
    })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
    })
  })

  it('renders additional information section', () => {
    render(<BookConsultationPage />)
    
    expect(screen.getByText(/have questions before booking\?/i)).toBeInTheDocument()
    expect(screen.getByText(/feel free to reach out using the contact form/i)).toBeInTheDocument()
  })
})