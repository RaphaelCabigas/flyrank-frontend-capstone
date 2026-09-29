import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import './Tabs.scss'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  /** Accessible name for the tablist. */
  label: string
  defaultTabId?: string
}

export function Tabs({ tabs, label, defaultTabId }: TabsProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState<string | undefined>(
    defaultTabId ?? tabs[0]?.id,
  )
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const getTabId = (id: string) => `${baseId}-tab-${id}`
  const getPanelId = (id: string) => `${baseId}-panel-${id}`

  // Automatic activation: moving focus with the arrow keys also selects.
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    // Leave browser/OS shortcuts alone (e.g. Alt+ArrowLeft is history-back).
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    let nextIndex: number
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    setActiveId(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs-list">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={getTabId(tab.id)}
              aria-selected={isActive}
              aria-controls={getPanelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              className="tabs-tab"
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={getPanelId(tab.id)}
            aria-labelledby={getTabId(tab.id)}
            hidden={!isActive}
            // Panel is a tab stop only while visible, so Tab from the tablist
            // lands in the content (APG: panels without focusable content).
            tabIndex={isActive ? 0 : undefined}
            className="tabs-panel"
          >
            {tab.content}
          </div>
        )
      })}
    </div>
  )
}
