import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { AUTH_STORAGE_KEY, getStoredAuth } from "../utils/auth"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = getStoredAuth();
        if (authData) {
          const { token, user } = authData;
          if (token && user) {
            console.log('Auto login with stored user:', user);
            setToken(token);
            setUser(user);
            setIsAuthenticated(true);
            console.log('Auto login successful');
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [])

  const login = (token, user) => {
    console.log('User logged in:', user);
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
