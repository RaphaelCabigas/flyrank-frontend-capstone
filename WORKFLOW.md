# WORKFLOW.md — Vague Prompt vs. Precise Prompt (LoginForm)

### Round One

Prompt: `"Make a login form for my React Vite Project"`

no file references, no constraints, no
verification step ("build a login form"). Output accepted as-is, pushed to
`ai-vague-prompt`.

### Round Two

Prompt: `"Read CLAUDE.md and src/index.css for conventions. Build src/components/LoginForm.jsx + matching stylesheet: email field (required, valid format) and password field (required, min 8 chars) with a show/hide toggle. Accept an onSubmit prop that receives { email, password } and may throw/reject — surface that as a form-level error. Constraints: functional component, hooks only, kebab-case classes, use existing CSS variables from index.css, every input has an associated <label>, errors use aria-invalid + aria-describedby, visible focus states. After writing it, write Vitest + React Testing Library tests covering: empty-field errors, invalid email format, short password, successful submit calling onSubmit with the right payload, and a submit that rejects and shows the form-level error. Run the tests and fix anything that fails before you're done."`

referencing `CLAUDE.md` directly, naming the existing SCSS/kebab-case convention, naming the existing CSS
variables in `src/index.css` to reuse, specifying accessible show/hide-password behavior, and ending with an explicit verification step: "write it, then write tests with Vitest + Testing Library and run them." Pushed to `ai-detailed-prompt`.

## Differences

**Correctness:** the vague branch's `validate()` runs the email regex against the untrimmed input. `^[^\s@]+` rejects any leading
whitespace, so `"  a@b.com"` — a value a user could easily produce by autofill or a stray space — is flagged invalid even though it's a legitimate address once trimmed. I caught this by reading the regex against the raw `values.email`, not by inspection of behavior; it never surfaced until I
compared it to round two's `email.trim()` call. This is exactly the kind of bug a vague prompt lets through: it looks done, runs, and passes a casual
click-through.

**Accessibility:** round two's password-toggle button sets `aria-pressed={showPassword}`; round one's equivalent button has no pressed state, so a screen reader announces "Show, button" regardless of state.

**Edge cases:** round one added an extra `onSuccess` callback with no test covering it. Round two extracted `validateFields` as a standalone exported function, which is what made a 5-case test suite (empty fields, bad email, short password, success, rejected submit) possible in the first place.

**Maintainability:** round one invented its own CSS variables (`--lf-accent`, etc.) and imported a Google Font, diverging from the app's existing `index.css` tokens. Round two reused `var(--accent)`, `var(--border)`, etc., and followed the `login-form` kebab-case + SCSS convention already in `CLAUDE.md`.

**Review Time:** round one took ~10 minutes to prompt but ~25 minutes to review by hand (tracing validation, checking the regex against edge inputs, eyeballing the theme mismatch) — no automated way to confirm it worked. Round two took ~20 minutes to prompt and set up (writing the constraints, waiting on the explore-plan-code loop) but under 10 minutes to review, because the test run itself was the verification. Round two was slower to start and faster end-to-end.

## Conclusion

The vague prompt produced something that looked finished; the detailed prompt with a built-in verification step produced something that was verified.
