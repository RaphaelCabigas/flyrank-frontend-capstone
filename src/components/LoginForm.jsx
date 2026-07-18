import { useState } from "react";
import "./LoginForm.css";

/**
 * LoginForm
 *
 * Usage:
 *   <LoginForm onSubmit={async ({ email, password }) => {
 *     const res = await fetch("/api/login", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ email, password }),
 *     });
 *     if (!res.ok) throw new Error("Invalid email or password");
 *   }} />
 *
 * Props:
 *   onSubmit(values) -> Promise    Called with { email, password }.
 *                                  Throw an Error to show its message as a form-level error.
 *   onSuccess()                   Optional. Called after onSubmit resolves without error.
 */
export default function LoginForm({ onSubmit, onSuccess }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [succeeded, setSucceeded] = useState(false);

  const errors = validate(values);

  function handleChange(field) {
    return (e) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (formError) setFormError("");
    };
  }

  function handleBlur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFormError("");
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setSucceeded(true);
      onSuccess?.();
    } catch (err) {
      setFormError(err?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="lf-card">
      <div className="lf-mark" aria-hidden="true" />
      <h1 className="lf-heading">Welcome back</h1>
      <p className="lf-subheading">Sign in to continue.</p>

      <form className="lf-form" onSubmit={handleSubmit} noValidate>
        <div className="lf-field">
          <label htmlFor="lf-email">Email</label>
          <input
            id="lf-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby="lf-email-error"
          />
          {touched.email && errors.email && (
            <p className="lf-error" id="lf-email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="lf-field">
          <div className="lf-label-row">
            <label htmlFor="lf-password">Password</label>
            <button
              type="button"
              className="lf-link-btn"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="lf-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange("password")}
            onBlur={handleBlur("password")}
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby="lf-password-error"
          />
          {touched.password && errors.password && (
            <p className="lf-error" id="lf-password-error">
              {errors.password}
            </p>
          )}
        </div>

        {formError && (
          <p className="lf-form-error" role="alert">
            {formError}
          </p>
        )}

        {succeeded && !formError && (
          <p className="lf-form-success" role="status">
            Signed in.
          </p>
        )}

        <button className="lf-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function validate({ email, password }) {
  const errors = {};
  if (!email) {
    errors.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}
