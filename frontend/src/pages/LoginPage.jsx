import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './LoginPage.css';

/* ── Logo shapes (reusable inline) ── */
function TraveloopLogo({ size = 'md' }) {
  const s = size === 'sm' ? 42 : 56;
  return (
    <div className={`tl-logo tl-logo--${size}`}>
      <span className="shape-square" style={{ width: s, height: s }} />
      <span className="shape-circle" style={{ width: s, height: s }} />
      <span className="shape-diamond" style={{ width: s * 0.85, height: s * 0.85 }} />
    </div>
  );
}

/* ── Field error ── */
function FieldError({ msg }) {
  if (!msg) return null;
  return <span className="field-error" role="alert">{msg}</span>;
}

/* ── Loading spinner ── */
function Spinner() {
  return <span className="spinner" aria-label="Loading" />;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: authLogin, token } = useAuth();

  // Tab state — driven by ?tab= query param
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState(initialTab);

  // ── Login form state ──
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginServerError, setLoginServerError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  // ── Signup form state ──
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupServerError, setSignupServerError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);

  // ── Switch tab ──
  function switchTab(t) {
    setTab(t);
    setLoginErrors({});
    setLoginServerError('');
    setSignupErrors({});
    setSignupServerError('');
  }

  // ── Login validation ──
  function validateLogin() {
    const errs = {};
    if (!loginForm.email) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errs.email = 'Enter a valid email.';
    if (!loginForm.password) errs.password = 'Password is required.';
    return errs;
  }

  // ── Signup validation ──
  function validateSignup() {
    const errs = {};
    if (!signupForm.name.trim()) errs.name = 'Name is required.';
    if (!signupForm.email) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Enter a valid email.';
    if (!signupForm.password) errs.password = 'Password is required.';
    else if (signupForm.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!signupForm.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (signupForm.password !== signupForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  // ── Handle Login submit ──
  async function handleLogin(e) {
    e.preventDefault();
    setLoginServerError('');
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    setLoginLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: loginForm.email,
        password: loginForm.password,
      });
      authLogin(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setLoginServerError(msg);
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Handle Signup submit ──
  async function handleSignup(e) {
    e.preventDefault();
    setSignupServerError('');
    const errs = validateSignup();
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    setSignupLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: signupForm.name.trim(),
        email: signupForm.email,
        password: signupForm.password,
      });
      authLogin(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setSignupServerError(msg);
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        {/* ── Logo ── */}
        <TraveloopLogo size="md" />
        <h1 className="login-wordmark">Traveloop</h1>

        {/* ── Tabs ── */}
        <div className="tab-bar" role="tablist">
          <button
            id="tab-login"
            role="tab"
            aria-selected={tab === 'login'}
            className={`tab-btn${tab === 'login' ? ' tab-btn--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            id="tab-signup"
            role="tab"
            aria-selected={tab === 'signup'}
            className={`tab-btn${tab === 'signup' ? ' tab-btn--active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* ══════════════════════════════
            LOGIN FORM
        ══════════════════════════════ */}
        {tab === 'login' && (
          <form
            id="login-form"
            className="auth-form"
            onSubmit={handleLogin}
            noValidate
          >
            {loginServerError && (
              <div className="server-error" role="alert">{loginServerError}</div>
            )}

            {/* Email */}
            <div className="field-group">
              <input
                id="login-email"
                type="email"
                className={`field-input${loginErrors.email ? ' field-input--error' : ''}`}
                placeholder="Email Address"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              />
              <FieldError msg={loginErrors.email} />
            </div>

            {/* Password */}
            <div className="field-group">
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showLoginPass ? 'text' : 'password'}
                  className={`field-input${loginErrors.password ? ' field-input--error' : ''}`}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowLoginPass((v) => !v)}
                >
                  {showLoginPass ? '🙈' : '👁️'}
                </button>
              </div>
              <FieldError msg={loginErrors.password} />
            </div>

            {/* Forgot password */}
            <div className="form-meta">
              <button type="button" className="link-btn" id="forgot-password-btn">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loginLoading}
            >
              {loginLoading ? <Spinner /> : 'Begin Your Journey'}
            </button>

            <p className="switch-text">
              Don&apos;t have an account?{' '}
              <button type="button" className="link-btn" onClick={() => switchTab('signup')}>
                Sign up
              </button>
            </p>
          </form>
        )}

        {/* ══════════════════════════════
            SIGNUP FORM
        ══════════════════════════════ */}
        {tab === 'signup' && (
          <form
            id="signup-form"
            className="auth-form"
            onSubmit={handleSignup}
            noValidate
          >
            {signupServerError && (
              <div className="server-error" role="alert">{signupServerError}</div>
            )}

            {/* Name */}
            <div className="field-group">
              <input
                id="signup-name"
                type="text"
                className={`field-input${signupErrors.name ? ' field-input--error' : ''}`}
                placeholder="Full Name"
                autoComplete="name"
                value={signupForm.name}
                onChange={(e) => setSignupForm((f) => ({ ...f, name: e.target.value }))}
              />
              <FieldError msg={signupErrors.name} />
            </div>

            {/* Email */}
            <div className="field-group">
              <input
                id="signup-email"
                type="email"
                className={`field-input${signupErrors.email ? ' field-input--error' : ''}`}
                placeholder="Email Address"
                autoComplete="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
              />
              <FieldError msg={signupErrors.email} />
            </div>

            {/* Password */}
            <div className="field-group">
              <div className="password-wrapper">
                <input
                  id="signup-password"
                  type={showSignupPass ? 'text' : 'password'}
                  className={`field-input${signupErrors.password ? ' field-input--error' : ''}`}
                  placeholder="Password (min 8 chars)"
                  autoComplete="new-password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowSignupPass((v) => !v)}
                >
                  {showSignupPass ? '🙈' : '👁️'}
                </button>
              </div>
              <FieldError msg={signupErrors.password} />
            </div>

            {/* Confirm Password */}
            <div className="field-group">
              <input
                id="signup-confirm-password"
                type="password"
                className={`field-input${signupErrors.confirmPassword ? ' field-input--error' : ''}`}
                placeholder="Confirm Password"
                autoComplete="new-password"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              />
              <FieldError msg={signupErrors.confirmPassword} />
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={signupLoading}
            >
              {signupLoading ? <Spinner /> : 'Create Account'}
            </button>

            <p className="switch-text">
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={() => switchTab('login')}>
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
