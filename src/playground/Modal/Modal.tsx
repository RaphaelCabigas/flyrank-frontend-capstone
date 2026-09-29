import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import './Modal.scss'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  /** Element to focus on open. Defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Skips anything inside a [hidden] subtree (e.g. a collapsed Disclosure);
// otherwise a hidden "last" element breaks the wrap-around logic.
// Does not detect CSS-only hiding (display: none / visibility: hidden).
const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.closest('[hidden]') === null)

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) return

    const overlay = overlayRef.current
    const panel = panelRef.current
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    // Make the rest of the page inert: no Tab, no click, no AT virtual cursor.
    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlay,
    )
    const newlyInert = siblings.filter((element) => !element.hasAttribute('inert'))
    newlyInert.forEach((element) => element.setAttribute('inert', ''))

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (panel) {
      const target =
        initialFocusRef?.current ?? getFocusableElements(panel)[0] ?? panel
      target.focus()
    }

    return () => {
      newlyInert.forEach((element) => element.removeAttribute('inert'))
      document.body.style.overflow = previousOverflow
      // Un-inert first: focus() is a no-op on elements inside an inert subtree.
      if (opener?.isConnected) opener.focus()
    }
  }, [isOpen, initialFocusRef])

  if (!isOpen) return null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const panel = panelRef.current
    if (!panel) return

    const focusable = getFocusableElements(panel)
    if (focusable.length === 0) {
      event.preventDefault()
      panel.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  // mousedown, not click: a text-selection drag that starts inside the panel
  // and ends on the overlay must not dismiss the dialog.
  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="modal-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="modal-panel"
        onKeyDown={handleKeyDown}
      >
        <header className="modal-header">
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="modal-close-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        {description && (
          <p id={descriptionId} className="modal-description">
            {description}
          </p>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
