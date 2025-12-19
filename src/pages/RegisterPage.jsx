import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* ---------------- Animations ---------------- */
  const pageAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 }
  }

  const cardAnim = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  /* ---------------- Password Strength ---------------- */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' }

    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++

    if (strength <= 2) return { level: 1, text: 'Weak', color: '#ef4444' }
    if (strength <= 4) return { level: 2, text: 'Medium', color: '#f59e0b' }
    return { level: 3, text: 'Strong', color: '#22c55e' }
  }

  const passwordStrength = getPasswordStrength(password)

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) newErrors.name = 'Full name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(email)) newErrors.email = 'Invalid email'

    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6)
      newErrors.password = 'Minimum 6 characters required'
    else if (passwordStrength.level === 1)
      newErrors.password = 'Password is too weak'

    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirm your password'
    else if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      await register({ name, email, password })
      navigate('/account')
    } catch (e) {
      setError(e.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div {...pageAnim} className="row justify-content-center">
      <motion.div {...cardAnim} className="col-md-6 col-lg-5 auth-wrapper">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3 className="text-center mb-2">Create Account</h3>
            <p className="text-muted text-center mb-4">
              Join us to manage your profile
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  exit={{ opacity: 0 }}
                  className="alert alert-danger"
                >
                  <strong>Registration Failed:</strong> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label>Full Name</label>
                <input
                  className={`form-control ${errors.name && 'is-invalid'}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label>Email</label>
                <input
                  className={`form-control ${errors.email && 'is-invalid'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
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

                {password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <div className="password-strength-bar">
                      <motion.div
                        className="password-strength-fill"
                        style={{
                          backgroundColor: passwordStrength.color,
                          height: '6px'
                        }}
                        animate={{
                          width: `${(passwordStrength.level / 3) * 100}%`
                        }}
                      />
                    </div>
                    <small style={{ color: passwordStrength.color }}>
                      Strength: {passwordStrength.text}
                    </small>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${
                      confirmPassword && password !== confirmPassword
                        ? 'is-invalid'
                        : confirmPassword && password === confirmPassword
                        ? 'is-valid'
                        : ''
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(p => !p)}
                  >
                    <i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                className="btn btn-primary w-100"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </form>

            <hr />
            <p className="text-center mb-0">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RegisterPage
