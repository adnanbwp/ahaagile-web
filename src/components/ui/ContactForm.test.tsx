import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

// Mock fetch
global.fetch = jest.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders form with all required fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByText(/alternative contact form/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message \*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<ContactForm className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    
    // Fill in valid data for other fields so only email validation fails
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'invalid-email')
    await user.type(messageInput, 'This is a valid message with enough characters')
    
    // Trigger validation by blurring the email field
    await user.click(emailInput)
    await user.tab()
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('validates minimum field lengths', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    
    await user.type(nameInput, 'A')
    await user.type(messageInput, 'Short')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Your message has been sent successfully.'
      })
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name \*/i), 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message \*/i), 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'Test message with sufficient length'
        })
      })
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Your message has been sent successfully.'
      })
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name \*/i), 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message \*/i), 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent successfully/i)).toBeInTheDocument()
    })
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Your message has been sent successfully.'
      })
    })
    
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name \*/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/email \*/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message \*/i) as HTMLTextAreaElement
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john.doe@example.com')
    await user.type(messageInput, 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        status: 'error',
        message: 'Server error occurred.'
      })
    })
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name \*/i), 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message \*/i), 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/server error occurred/i)).toBeInTheDocument()
    })
  })

  it('shows network error message on network failure', async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name \*/i), 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message \*/i), 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/network error.*please check your connection/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    ;(fetch as jest.Mock).mockReturnValueOnce(promise)
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/name \*/i), 'John Doe')
    await user.type(screen.getByLabelText(/email \*/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/message \*/i), 'Test message with sufficient length')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeDisabled()
    
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

  it('has proper accessibility attributes', () => {
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/name \*/i)
    const emailInput = screen.getByLabelText(/email \*/i)
    const messageInput = screen.getByLabelText(/message \*/i)
    
    expect(nameInput).toHaveAttribute('id', 'name')
    expect(emailInput).toHaveAttribute('id', 'email')
    expect(messageInput).toHaveAttribute('id', 'message')
    
    expect(screen.getByLabelText(/name \*/i)).toHaveAttribute('aria-describedby')
    expect(screen.getByLabelText(/email \*/i)).toHaveAttribute('aria-describedby')
    expect(screen.getByLabelText(/message \*/i)).toHaveAttribute('aria-describedby')
  })
})