import { createContext, useContext, useEffect, useState } from 'react'

// Key used to store users and current session in localStorage
const STORAGE_KEY = 'account_manager_users'
const CURRENT_USER_KEY = 'account_manager_current_user'

const AuthContext = createContext(null)

// Simple helper to read users from localStorage
function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// Simple helper to write users to localStorage
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// Simple helper to read current user from localStorage
function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Simple helper to write current user to localStorage
function saveCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY)
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [initialised, setInitialised] = useState(false)

  // Load any existing data when the app first mounts
  useEffect(() => {
    const storedUsers = loadUsers()
    const storedCurrentUser = loadCurrentUser()
    setUsers(storedUsers)
    setCurrentUser(storedCurrentUser)
    setInitialised(true)
  }, [])

  // Register a new account
  const register = ({ name, email, password }) => {
    // Basic duplicate email check
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      throw new Error('An account with this email already exists.')
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    saveUsers(updatedUsers)

    // Automatically log the user in after registration
    setCurrentUser(newUser)
    saveCurrentUser(newUser)
  }

  // Log in with an existing account
  const login = ({ email, password }) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!user) {
      throw new Error('Invalid email or password.')
    }
    setCurrentUser(user)
    saveCurrentUser(user)
  }

  // Log out the current user
  const logout = () => {
    setCurrentUser(null)
    saveCurrentUser(null)
  }

  // Update the current user's profile
  const updateProfile = ({ name, email, password }) => {
    if (!currentUser) return

    // Make sure we are not taking another user's email
    const emailTakenByAnother = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== currentUser.id,
    )
    if (emailTakenByAnother) {
      throw new Error('Another account is already using this email.')
    }

    const updatedUser = {
      ...currentUser,
      name,
      email,
      password: password || currentUser.password, // Keep old password if none provided
    }

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setCurrentUser(updatedUser)
    saveCurrentUser(updatedUser)
  }

  // Delete the current user's account
  const deleteAccount = () => {
    if (!currentUser) return

    const updatedUsers = users.filter((u) => u.id !== currentUser.id)
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    setCurrentUser(null)
    saveCurrentUser(null)
  }

  // Reload users from localStorage (useful after external updates like password reset)
  const refreshUsers = () => {
    const storedUsers = loadUsers()
    setUsers(storedUsers)
  }

  const value = {
    initialised,
    users,
    currentUser,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    refreshUsers,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}



