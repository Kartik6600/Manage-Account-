import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

function AccountPage() {
  const { currentUser, updateProfile, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const [editingField, setEditingField] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordView, setShowPasswordView] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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

  const editAnim = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
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

  const passwordStrength = getPasswordStrength(formData.password)

  const handleEditClick = (field) => {
    setEditingField(field)
    setError('')
    setMessage('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setFormData({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      password: ''
    })
    setShowPassword(false)
    setShowPasswordView(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (field) => {
    setError('')
    setMessage('')
    try {
      setIsSaving(true)
      const data = {
        name: field === 'name' ? formData.name : currentUser.name,
        email: field === 'email' ? formData.email : currentUser.email,
        ...(field === 'password' && { password: formData.password })
      }
      await updateProfile(data)
      setMessage(`${field} updated successfully.`)
      setEditingField(null)
    } catch (e) {
      setError(e.message || `Unable to update ${field}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (!currentUser) {
    return <p className="text-center mt-5">Login required</p>
  }

  return (
    <motion.div {...pageAnim} className="row justify-content-center">
      <motion.div {...cardAnim} className="col-md-8 col-lg-6">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3>
              Welcome Back, <span className="text-primary">{currentUser.name}</span>
            </h3>
            <p className="text-muted mb-4">Manage your account details</p>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="alert alert-success"
                >
                  {message}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  exit={{ opacity: 0 }}
                  className="alert alert-danger"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name */}
            <div className="mb-4">
              <small className="text-muted">Name</small>
              <AnimatePresence>
                {editingField === 'name' ? (
                  <motion.div {...editAnim}>
                    <input
                      name="name"
                      className="form-control mb-2"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleSave('name')}
                      disabled={isSaving}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <p>{currentUser.name}</p>
                )}
              </AnimatePresence>
              {editingField !== 'name' && (
                <button
                  className="btn btn-link p-0"
                  onClick={() => handleEditClick('name')}
                >
                  Edit
                </button>
              )}
              <hr />
            </div>

            {/* Password */}
            <div className="mb-4">
              <small className="text-muted">Password</small>
              <AnimatePresence>
                {editingField === 'password' ? (
                  <motion.div {...editAnim}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control mb-2"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {formData.password && (
                      <motion.div
                        animate={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                        style={{
                          height: 6,
                          background: passwordStrength.color,
                          marginBottom: 6
                        }}
                      />
                    )}
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleSave('password')}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <p>{'•'.repeat(8)}</p>
                )}
              </AnimatePresence>
              {editingField !== 'password' && (
                <button
                  className="btn btn-link p-0"
                  onClick={() => handleEditClick('password')}
                >
                  Edit
                </button>
              )}
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-danger me-2"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline-secondary"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </motion.button>

            {/* Delete Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="modal show d-block"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="modal-dialog modal-dialog-centered"
                  >
                    <div className="modal-content">
                      <div className="modal-body">
                        <p className="text-danger fw-bold">
                          Delete account permanently?
                        </p>
                        <button
                          className="btn btn-danger me-2"
                          onClick={deleteAccount}
                        >
                          Yes, Delete
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AccountPage
