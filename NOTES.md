# NOTES: What shadcn handled that I missed

I built `Modal`, `Tabs` and `Disclosure` by hand in `src/playground/` against the
APG patterns, then added shadcn's `dialog` and `tabs` and read the generated
source (`src/components/ui/dialog.tsx`, `tabs.tsx`, `button.tsx`).

**The main thing I learned from reading it:** the generated files are thin
styling wrappers. Almost all behavior (focus trap, dismissal, roving focus,
ARIA wiring) lives in `@base-ui/react`. So "what shadcn handled" really means
"what Base UI handles that I didn't".

---

## Concrete gaps between my version and shadcn's

### 1. Focus restore depends on `document.activeElement` (Modal)

Mine: in the effect I capture `opener = document.activeElement` when the modal
opens. That is fragile. Safari and Firefox on macOS do not focus a `<button>`
when it is clicked, so `activeElement` can be `<body>` and focus is "returned"
to nowhere. It also breaks if the modal is opened programmatically (a timer,
a route change).

shadcn: `DialogTrigger` is a real part of the component, so the dialog knows
its opener by reference rather than by guessing at open time. Base UI also
exposes a final-focus option for choosing where focus goes on close **(verify
prop name)**.

Fix in mine: accept a `returnFocusRef` / trigger ref prop instead of sniffing
`activeElement`.

### 2. Escape only works while focus is inside the panel (Modal)

Mine: `onKeyDown` is attached to the panel `<div>`. If focus ever ends up on
`<body>` (for example the focused button becomes `disabled` or is unmounted
while the modal is open), Escape silently stops working and there is no
keyboard way to close.

shadcn: dismissal is handled by Base UI rather than by a handler on the popup
element, so it does not depend on where focus currently is **(verify: check
whether it listens at document level)**.

Fix in mine: listen for `keydown` on `document` while open, or re-focus the
panel when focus is lost.

### 3. No exit transition or mount lifecycle (Modal)

Mine: `if (!isOpen) return null` unmounts instantly, so I cannot animate out
without rewriting the lifecycle.

shadcn: the generated classes use `data-open:` / `data-closed:` with
`animate-in` / `animate-out`. That only works because Base UI keeps the popup
mounted until the exit animation finishes and exposes the state as data
attributes. Neither version has a `prefers-reduced-motion` guard in the code I
read; that is a gap in both.

### 4. Composition and controlled/uncontrolled state (Modal)

Mine: `title` and `description` are plain `string` props and `isOpen` is
always controlled, with the caller wiring up the opener button.

shadcn: `DialogTitle` and `DialogDescription` are components that register
themselves with the dialog, so the title can contain rich content and
`aria-labelledby` / `aria-describedby` are wired automatically. `DialogTrigger`
and `DialogClose` are built in. `DialogContent` has a `showCloseButton` prop
and renders its close button through Base UI's `render` prop (polymorphism)
instead of a hardcoded `<button>`. Also, Base UI ships an `AlertDialog`
(`role="alertdialog"`) for confirmations; I have no equivalent.

### 5. Scroll lock is simplistic (Modal)

Mine: `document.body.style.overflow = 'hidden'`. When the scrollbar disappears
the page shifts sideways by the scrollbar width, and iOS Safari largely ignores
`overflow: hidden` on `body`. Base UI has its own scroll-lock handling **(verify:
scrollbar compensation and iOS behavior)**.

### 6. Tabs: no orientation, no disabled tabs, hardcoded direction

Mine handles only horizontal tabs with ArrowLeft/ArrowRight.

shadcn's `Tabs` takes an `orientation` prop and the classes have
`data-horizontal` / `data-vertical` variants, so vertical tabs (which need
`aria-orientation="vertical"` and Up/Down arrows per APG) are supported. The
trigger styles also include `disabled` / `aria-disabled` states, meaning
disabled tabs exist and should be skipped by arrow navigation. Mine would
happily focus a disabled tab, and I have no way to express one.
`components.json` even has an `rtl` flag: in RTL languages ArrowLeft/ArrowRight
should be reversed, which my hardcoded switch does not do.

### 7. Tabs: `activeId` can go stale and strand keyboard users

Mine: `activeId` is set once from `defaultTabId ?? tabs[0]?.id`. If the `tabs`
prop later changes and the active id no longer exists, no tab is selected, so
**no tab has `tabIndex={0}`** and the whole tablist becomes unreachable with
Tab. I only tested a static list. shadcn/Base UI supports a controlled `value`
and tracks the tab list itself **(verify how it recovers when the selected tab
is removed)**.

### 8. Tabs: only automatic activation

Mine always selects on arrow-key focus. APG allows automatic _or_ manual
activation (better when panels are expensive to render). Base UI exposes this as
an option on the list **(verify prop name)**; mine is fixed.

---

## Mistakes in my own code that this review exposed

- **Tab panel `tabIndex` comment does not match the code.** The comment says the
  panel is a tab stop "for panels without focusable content" (the APG rule), but
  the code sets `tabIndex={0}` on every visible panel, including ones that
  contain buttons or links. That adds a redundant tab stop.
- **`getFocusableElements` only skips `[hidden]` subtrees.** I documented that
  it misses CSS `display: none` / `visibility: hidden`. A real library needs a
  proper visibility check, or the wrap-around logic can land on an invisible
  element.
- **`max-height: calc(100vh - 32px)`** on the modal panel should use `dvh` so
  mobile browser chrome does not clip the panel.

## Where mine already matches shadcn's behavior

- Roles and states: `role="dialog"`, `aria-modal`, `aria-labelledby`,
  `aria-describedby`, `role="tablist/tab/tabpanel"`, `aria-selected`,
  `aria-controls`, `aria-expanded`.
- Roving tabindex, Home/End, and wrap-around on arrows in Tabs.
- Rest of the page made `inert` while the modal is open (a stronger approach
  than `aria-hidden` alone), plus focus return on close and a pointer
  "mousedown, not click" backdrop guard that protects text-selection drags.
- The Disclosure needed no library: a native `<button>` with `aria-expanded` +
  `aria-controls` is the whole pattern. (I did not add a shadcn disclosure, so
  there is nothing to compare; shadcn's closest equivalents are Collapsible and
  Accordion.)

## Takeaway for reviewing AI-generated components

Do not stop at "it renders and Tab works". Ask: (1) how does it find and restore
focus, (2) what happens when focus is lost, (3) what happens when props change
after mount, (4) are orientation / disabled / RTL / reduced motion handled or
deliberately out of scope, and (5) did the generator change global tokens that
other components rely on.
