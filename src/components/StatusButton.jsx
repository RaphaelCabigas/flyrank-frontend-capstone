import { useEffect, useRef, useState } from 'react'
import './StatusButton.scss'

// Order matters: the CSS uses each layer's index to decide which way it
// slides (see --index / --active in StatusButton.scss).
const ORDER = ['idle', 'loading', 'success', 'error']

const DEFAULT_LABELS = {
  idle: 'Send message',
  loading: 'Sending…',
  success: 'Sent',
  error: 'Retry send',
}

function SpinnerIcon() {
  return (
    <svg
      className="status-button-icon status-button-spinner"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      className="status-button-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function RetryIcon() {
  return (
    <svg
      className="status-button-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

/**
 * A button that owns its whole lifecycle: idle → loading → success | error.
 *
 * `onAction` should return a promise. Resolve = success, reject/throw = error.
 * Clicks are ignored while loading or showing success; from the error state a
 * click retries immediately.
 */
function StatusButton({
  onAction = () => Promise.resolve(),
  variant = 'primary',
  labels,
  icon = null,
  successDuration = 1800,
  disabled = false,
}) {
  const [status, setStatus] = useState('idle')

  // statusRef lets the click handler see the latest status even if two clicks
  // land before React re-renders. runId invalidates stale promises (unmount,
  // or a newer run starting) so they can't overwrite fresh state.
  const statusRef = useRef('idle')
  const runId = useRef(0)
  const resetTimer = useRef(null)

  const mergedLabels = { ...DEFAULT_LABELS, ...labels }

  const updateStatus = (next) => {
    statusRef.current = next
    setStatus(next)
  }

  useEffect(() => {
    return () => {
      runId.current += 1
      clearTimeout(resetTimer.current)
    }
  }, [])

  const handleClick = async () => {
    if (disabled) return
    if (statusRef.current === 'loading' || statusRef.current === 'success') return

    clearTimeout(resetTimer.current)
    runId.current += 1
    const currentRun = runId.current
    updateStatus('loading')

    try {
      await onAction()
      if (currentRun !== runId.current) return
      updateStatus('success')
      resetTimer.current = setTimeout(() => {
        if (currentRun === runId.current) updateStatus('idle')
      }, successDuration)
    } catch {
      if (currentRun !== runId.current) return
      updateStatus('error')
    }
  }

  const liveMessages = {
    idle: '',
    loading: mergedLabels.loading,
    success: mergedLabels.success,
    error: `Something went wrong. ${mergedLabels.error}`,
  }

  const isBusy = status === 'loading'
  const isInert = status === 'loading' || status === 'success'

  return (
    <>
      <button
        type="button"
        className="status-button"
        data-state={status}
        data-variant={variant}
        disabled={disabled}
        aria-busy={isBusy}
        aria-disabled={isInert || undefined}
        onClick={handleClick}
      >
        <span className="status-button-body" style={{ '--active': ORDER.indexOf(status) }}>
          <span className="status-button-fill status-button-fill-idle" aria-hidden="true" />
          <span className="status-button-fill status-button-fill-success" aria-hidden="true" />
          <span className="status-button-fill status-button-fill-error" aria-hidden="true" />
          <span className="status-button-sheen" aria-hidden="true" />

          <span className="status-button-content">
            {ORDER.map((key, index) => (
              <span
                key={key}
                className="status-button-layer"
                data-layer={key}
                data-active={key === status}
                aria-hidden={key !== status}
                style={{ '--index': index }}
              >
                {key === 'idle' && icon && (
                  <span className="status-button-icon" aria-hidden="true">
                    {icon}
                  </span>
                )}
                {key === 'loading' && <SpinnerIcon />}
                {key === 'success' && <CheckIcon />}
                {key === 'error' && <RetryIcon />}
                <span className="status-button-label">{mergedLabels[key]}</span>
              </span>
            ))}
          </span>
        </span>
      </button>

      <span className="status-button-live" role="status">
        {liveMessages[status]}
      </span>
    </>
  )
}

export default StatusButton
