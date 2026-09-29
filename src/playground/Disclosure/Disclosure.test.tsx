import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Disclosure } from './Disclosure'

describe('Disclosure', () => {
  it('starts collapsed with the panel hidden', () => {
    render(<Disclosure summary="More info">Details</Disclosure>)
    const button = screen.getByRole('button', { name: 'More info' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Details')).not.toBeVisible()
  })

  it('starts expanded when defaultExpanded is set', () => {
    render(
      <Disclosure summary="More info" defaultExpanded>
        Details
      </Disclosure>,
    )
    expect(screen.getByRole('button', { name: 'More info' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByText('Details')).toBeVisible()
  })

  it('points aria-controls at the panel', () => {
    render(<Disclosure summary="More info">Details</Disclosure>)
    const button = screen.getByRole('button', { name: 'More info' })
    const panelId = button.getAttribute('aria-controls') as string
    expect(document.getElementById(panelId)).toHaveTextContent('Details')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Disclosure summary="More info">Details</Disclosure>)
    const button = screen.getByRole('button', { name: 'More info' })
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Details')).toBeVisible()
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it.each([['{Enter}'], [' ']])('toggles with the keyboard (%j)', async (key) => {
    const user = userEvent.setup()
    render(<Disclosure summary="More info">Details</Disclosure>)
    await user.tab()
    await user.keyboard(key)
    expect(screen.getByRole('button', { name: 'More info' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
