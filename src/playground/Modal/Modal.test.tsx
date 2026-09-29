import { createRef, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Disclosure } from '../Disclosure/Disclosure'
import { Modal } from './Modal'

function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        description="Adjust your preferences."
      >
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    </>
  )
}

const openModal = async () => {
  const user = userEvent.setup()
  render(<ModalHarness />)
  const opener = screen.getByRole('button', { name: 'Open modal' })
  await user.click(opener)
  return { user, opener }
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden">
        content
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exposes dialog semantics with an accessible name and description', async () => {
    await openModal()
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Adjust your preferences.')
  })

  it('moves focus into the dialog on open', async () => {
    await openModal()
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
  })

  it('focuses initialFocusRef when provided', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Modal isOpen onClose={vi.fn()} title="Confirm" initialFocusRef={ref}>
        <button type="button">Delete</button>
        <button type="button" ref={ref}>
          Cancel
        </button>
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  it('wraps focus from the last element to the first on Tab', async () => {
    const { user } = await openModal()
    screen.getByRole('button', { name: 'Second' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
  })

  it('wraps focus from the first element to the last on Shift+Tab', async () => {
    const { user } = await openModal()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus()
  })

  it('ignores focusable elements inside collapsed (hidden) content when trapping', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen onClose={vi.fn()} title="With disclosure">
        <button type="button">Visible</button>
        <Disclosure summary="More">
          <button type="button">Buried</button>
        </Disclosure>
      </Modal>,
    )
    // Tab order: Close -> Visible -> More (disclosure button) -> wraps to Close.
    screen.getByRole('button', { name: 'More' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
  })

  it('makes the rest of the page inert while open and restores it after', async () => {
    const { user, opener } = await openModal()
    const pageContainer = opener.parentElement as HTMLElement
    expect(pageContainer).toHaveAttribute('inert')
    await user.keyboard('{Escape}')
    expect(pageContainer).not.toHaveAttribute('inert')
  })

  it('closes on Escape and returns focus to the opener', async () => {
    const { user, opener } = await openModal()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('closes via the close button and returns focus to the opener', async () => {
    const { user, opener } = await openModal()
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('closes when the backdrop is pressed but not when the panel is', async () => {
    const { user } = await openModal()
    await user.click(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locks body scroll while open and restores it after', async () => {
    const { user } = await openModal()
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })
})
