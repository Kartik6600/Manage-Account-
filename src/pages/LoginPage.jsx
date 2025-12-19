import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

function LoginPage() {
  const { login, refreshUsers } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetStep, setResetStep] = useState('email')

  /* ---------------- Animations ---------------- */
  const pageAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  }

  const cardAnim = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const modalAnim = {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 }
  }

  /* ---------------- Logic (unchanged) ---------------- */
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!validateEmail(email)) newErrors.email = 'Invalid email'

    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Incorrect password'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      await login({ email, password })
      navigate('/account')
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPasswordEmail = () => {
    setResetError('')
    if (!validateEmail(resetEmail)) {
      setResetError('Enter valid email')
      return
    }

    const users = JSON.parse(localStorage.getItem('account_manager_users') || '[]')
    if (!users.find(u => u.email === resetEmail)) {
      setResetError('Account not found')
      return
    }

    setResetStep('password')
    setResetMessage('Enter new password')
  }

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      setResetError('Minimum 6 characters required')
      return
    }

    const users = JSON.parse(localStorage.getItem('account_manager_users') || '[]')
    const updated = users.map(u =>
      u.email === resetEmail ? { ...u, password: newPassword } : u
    )

    localStorage.setItem('account_manager_users', JSON.stringify(updated))
    refreshUsers()

    setResetMessage('Password reset successfully!')
    setTimeout(() => setShowForgotPassword(false), 1500)
  }

  return (
    <motion.div {...pageAnim} className="row justify-content-center">
      <motion.div {...cardAnim} className="col-md-6 col-lg-4 auth-wrapper">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3 className="text-center mb-2">Sign In</h3>
            <p className="text-muted text-center mb-4">Access your account</p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  exit={{ opacity: 0 }}
                  className="alert alert-danger"
                >
                  <strong>Login Failed:</strong> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label>Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                  </button>
                </div>
              </div>

              <div className="text-end mb-3">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>

            <hr />
            <p className="text-center mb-0">
              New user? <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            <motion.div className="modal-backdrop show" />
            <motion.div {...modalAnim} className="modal show d-block">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>Reset Password</h5>
                    <button className="btn-close" onClick={() => setShowForgotPassword(false)} />
                  </div>

                  <div className="modal-body">
                    {resetError && <div className="alert alert-danger">{resetError}</div>}
                    {resetMessage && <div className="alert alert-success">{resetMessage}</div>}

                    {resetStep === 'email' ? (
                      <input
                        className="form-control"
                        placeholder="Enter email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    ) : (
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowForgotPassword(false)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={resetStep === 'email' ? handleForgotPasswordEmail : handleResetPassword}
                    >
                      {resetStep === 'email' ? 'Next' : 'Reset'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LoginPage
