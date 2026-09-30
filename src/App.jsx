import { useState } from 'react'
import StatusButton from './components/StatusButton.jsx'
import './App.scss'

const MODES = [
  { value: 'random', label: 'Random (20% fail)' },
  { value: 'success', label: 'Always succeed' },
  { value: 'failure', label: 'Always fail' },
]

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Fake network call: random 700–1800ms delay, outcome set by the demo trigger.
async function fakeRequest(mode) {
  await wait(700 + Math.random() * 1100)
  const shouldFail = mode === 'failure' || (mode === 'random' && Math.random() < 0.2)
  if (shouldFail) throw new Error('Request failed')
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

function App() {
  const [mode, setMode] = useState('random')

  return (
    <main className="demo-page">
      <header className="demo-header">
        <h1>Status button</h1>
        <p>
          Click, then click again while it works. Tab to it and press Enter or Space. Turn on
          reduced motion in your OS settings to see the calmer version.
        </p>
      </header>

      <section className="demo-stage" aria-label="Primary button">
        <StatusButton
          icon={<SendIcon />}
          onAction={() => fakeRequest(mode)}
        />

        <fieldset className="demo-modes">
          <legend>Next request</legend>
          {MODES.map((option) => (
            <label key={option.value} className="demo-mode">
              <input
                type="radio"
                name="mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="demo-family" aria-label="Same motion, other buttons">
        <h2>Same motion language</h2>
        <div className="demo-row">
          <StatusButton
            variant="secondary"
            icon={<UploadIcon />}
            labels={{
              idle: 'Deploy',
              loading: 'Deploying…',
              success: 'Deployed',
              error: 'Retry deploy',
            }}
            onAction={() => fakeRequest(mode)}
          />
          <StatusButton
            labels={{
              idle: 'Save changes',
              loading: 'Saving…',
              success: 'Saved',
              error: 'Retry save',
            }}
            onAction={() => fakeRequest(mode)}
          />
          <StatusButton disabled />
        </div>
      </section>

      <section className="demo-notes" aria-label="Motion notes">
        <h2>Why these timings</h2>
        <p>
          Labels leave in 140ms and arrive in 260ms, 60ms later, so exits feel quick and arrivals
          feel settled without the two overlapping. Fills crossfade in 300ms. Press is 80ms and
          release springs back in 300ms. The spinner turns at a constant speed; the error shake
          runs 420ms. Full notes are in the README.
        </p>
      </section>
    </main>
  )
}

export default App
