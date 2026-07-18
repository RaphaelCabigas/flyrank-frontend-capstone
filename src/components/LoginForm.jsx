import { useState } from "react";
import "./LoginForm.scss";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateFields(email, password) {
  const nextErrors = {};

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    nextErrors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    nextErrors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return nextErrors;
}

function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateFields(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), password });
    } catch (error) {
      setFormError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>Log in</h2>

      {formError && (
        <p className="login-form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="login-form-field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <span className="login-form-field-error" id="login-email-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="login-form-field">
        <label htmlFor="login-password">Password</label>
        <div className="login-form-password-wrapper">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            autoComplete="current-password"
          />
          <button
            type="button"
            className="login-form-toggle"
            onClick={() => setShowPassword((show) => !show)}
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <span className="login-form-field-error" id="login-password-error">
            {errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="login-form-submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

export default LoginForm;
export { validateFields };
