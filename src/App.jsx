import { Link, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import { useAuth } from './AuthContext.jsx'
import AccountPage from './pages/AccountPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { motion, AnimatePresence } from 'framer-motion'

/* ---------------- Animations ---------------- */
const navAnim = {
  initial: { y: -30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4 }
}

const pageAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.35 }
}

// Simple layout with a top navbar
function Layout({ children }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-root">
      {/* Navbar */}
      <motion.nav {...navAnim} className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Account Manager
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              {currentUser ? (
                <>
                  <li className="nav-item me-lg-2">
                    <span className="navbar-text small">
                      Signed in as {currentUser.name}
                    </span>
                  </li>
                  <li className="nav-item mt-2 mt-lg-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-light btn-sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </motion.button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        className="btn btn-light btn-sm ms-lg-2 mt-2 mt-lg-0"
                        to="/register"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

// Protect routes that require authentication
function PrivateRoute({ children }) {
  const { currentUser, initialised } = useAuth()

  if (!initialised) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-5"
      >
        <div className="spinner-border text-primary" role="status" />
      </motion.div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Navigate to="/account" replace />}
          />
          <Route
            path="/login"
            element={
              <motion.div {...pageAnim}>
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <motion.div {...pageAnim}>
                <RegisterPage />
              </motion.div>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <motion.div {...pageAnim}>
                  <AccountPage />
                </motion.div>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
