import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("foodforum_auth")
    if (stored) {
      const { token, user } = JSON.parse(stored)
      setToken(token)
      setUser(user)
    }
    setLoading(false)
  }, [])

  const login = (token, user) => {
    setToken(token)
    setUser(user)
    localStorage.setItem("foodforum_auth", JSON.stringify({ token, user }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("foodforum_auth")
  }

  if (loading) return null // or a spinner

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
