import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import StatusButton from './StatusButton.jsx'

const getButton = () => screen.getByRole('button')
const getState = () => getButton().getAttribute('data-state')

const click = async () => {
  await act(async () => {
    fireEvent.click(getButton())
  })
}

const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('StatusButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('starts idle with the idle label as its accessible name', () => {
    render(<StatusButton />)
    expect(getState()).toBe('idle')
    expect(screen.getByRole('button', { name: 'Send message' })).toBeTruthy()
  })

  it('enters loading on click and ignores extra clicks while loading', async () => {
    const pending = deferred()
    const onAction = vi.fn(() => pending.promise)
    render(<StatusButton onAction={onAction} />)

    await click()
    await click()
    await click()

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(getState()).toBe('loading')
    expect(getButton().getAttribute('aria-busy')).toBe('true')
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeTruthy()
  })

  it('shows success, then returns to idle after successDuration', async () => {
    const onAction = vi.fn().mockResolvedValue()
    render(<StatusButton onAction={onAction} successDuration={1000} />)

    await click()
    expect(getState()).toBe('success')
    expect(screen.getByRole('status').textContent).toBe('Sent')

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(getState()).toBe('success')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(getState()).toBe('idle')
  })

  it('ignores clicks while the success state is showing', async () => {
    const onAction = vi.fn().mockResolvedValue()
    render(<StatusButton onAction={onAction} />)

    await click()
    await click()

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(getState()).toBe('success')
  })

  it('shows the error state with a retry label when the action rejects', async () => {
    const onAction = vi.fn().mockRejectedValue(new Error('nope'))
    render(<StatusButton onAction={onAction} />)

    await click()

    expect(getState()).toBe('error')
    expect(screen.getByRole('button', { name: 'Retry send' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain('Something went wrong')
  })

  it('retries from the error state and can then succeed', async () => {
    const onAction = vi
      .fn()
      .mockRejectedValueOnce(new Error('nope'))
      .mockResolvedValueOnce()
    render(<StatusButton onAction={onAction} />)

    await click()
    expect(getState()).toBe('error')

    await click()
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(getState()).toBe('success')
  })

  it('does nothing when disabled', async () => {
    const onAction = vi.fn().mockResolvedValue()
    render(<StatusButton onAction={onAction} disabled />)

    await click()

    expect(onAction).not.toHaveBeenCalled()
    expect(getState()).toBe('idle')
    expect(getButton().disabled).toBe(true)
  })

  it('does not update state if it unmounts while the action is in flight', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const pending = deferred()
    const { unmount } = render(<StatusButton onAction={() => pending.promise} />)

    await click()
    unmount()

    await act(async () => {
      pending.resolve()
    })
    act(() => {
      vi.runAllTimers()
    })

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('uses custom labels', () => {
    render(<StatusButton labels={{ idle: 'Deploy' }} />)
    expect(screen.getByRole('button', { name: 'Deploy' })).toBeTruthy()
  })
})
