"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { getStoredAuth, storeAuth, clearAuth, mockLogin, mockRegister } from "../utils/auth"

const AuthContext = createContext()

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload, isAuthenticated: false }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case "REGISTER_START":
      return { ...state, loading: true, error: null }
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, error: null }
    case "REGISTER_ERROR":
      return { ...state, loading: false, error: action.payload }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load stored auth on mount
  useEffect(() => {
    const storedAuth = getStoredAuth()
    if (storedAuth && storedAuth.user && storedAuth.token) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: storedAuth,
      })
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const authData = await mockLogin(email, password)
      storeAuth(authData)
      dispatch({ type: "LOGIN_SUCCESS", payload: authData })
      return authData
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message })
      throw error
    }
  }

  // Register function
  const register = async (username, email, password) => {
    dispatch({ type: "REGISTER_START" })
    try {
      await mockRegister(username, email, password)
      dispatch({ type: "REGISTER_SUCCESS" })
      return { success: true }
    } catch (error) {
      dispatch({ type: "REGISTER_ERROR", payload: error.message })
      throw error
    }
  }

  // Logout function
  const logout = () => {
    clearAuth()
    dispatch({ type: "LOGOUT" })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
