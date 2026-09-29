import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs } from './Tabs'
import type { TabItem } from './Tabs'

const tabs: TabItem[] = [
  { id: 'one', label: 'One', content: 'First panel' },
  { id: 'two', label: 'Two', content: 'Second panel' },
  { id: 'three', label: 'Three', content: 'Third panel' },
]

const setup = () => {
  const user = userEvent.setup()
  render(<Tabs tabs={tabs} label="Example tabs" />)
  return user
}

describe('Tabs', () => {
  it('exposes tablist, tab and tabpanel roles wired together', () => {
    setup()
    expect(screen.getByRole('tablist', { name: 'Example tabs' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveTextContent('First panel')
  })

  it('selects the first tab and shows only its panel by default', () => {
    setup()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
  })

  it('uses a roving tabindex: only the selected tab is a tab stop', () => {
    setup()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves focus and selection with ArrowRight, wrapping at the end', async () => {
    const user = setup()
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Two' })).toBeVisible()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('moves with ArrowLeft, wrapping at the start', async () => {
    const user = setup()
    await user.tab()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Three' })).toBeVisible()
  })

  it('jumps to the first and last tab with Home and End', async () => {
    const user = setup()
    await user.tab()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
  })

  it('moves from the tablist into the visible panel on Tab', async () => {
    const user = setup()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveFocus()
  })

  it('ignores arrow keys pressed with modifiers so Alt+ArrowLeft still navigates back', async () => {
    const user = setup()
    await user.tab()
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('selects a tab on click', async () => {
    const user = setup()
    await user.click(screen.getByRole('tab', { name: 'Three' }))
    expect(screen.getByRole('tabpanel', { name: 'Three' })).toBeVisible()
  })
})
