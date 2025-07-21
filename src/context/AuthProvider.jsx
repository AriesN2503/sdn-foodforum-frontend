import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("foodforum_auth")
        if (stored) {
            try { // Add error handling for parsing
                const { token, user } = JSON.parse(stored);
                setToken(token);
                setUser(user);
                setIsAuthenticated(!!token && !!user);
            } catch (error) {
                console.error("Error parsing auth data from localStorage:", error);
                // Optionally clear invalid data
                localStorage.removeItem("foodforum_auth");
            }
        }
        setIsLoading(false); // Set to false once localStorage read is complete
    }, [])

    const login = (token, user) => {
        setToken(token)
        setUser(user)
        setIsAuthenticated(true)
        localStorage.setItem("foodforum_auth", JSON.stringify({ token, user }))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("foodforum_auth")
    }

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
