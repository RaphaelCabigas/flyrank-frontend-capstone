import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('shows validation errors when submitted with empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('shows an error when the email format is invalid', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/^password$/i), 'longenoughpw')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
  })

  it('shows an error when the password is shorter than 8 characters', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText(/email/i), 'person@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'short')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(
      await screen.findByText(/at least 8 characters/i),
    ).toBeInTheDocument()
  })

  it('calls onSubmit with the entered email and password on success', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'person@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'longenoughpw')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'person@example.com',
        password: 'longenoughpw',
      }),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a form-level error when onSubmit rejects', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new Error('Invalid credentials'))
    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'person@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'longenoughpw')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /invalid credentials/i,
    )
  })
})
