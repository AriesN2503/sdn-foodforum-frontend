import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import { useLocation } from "react-router-dom";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Ưu tiên lấy adminToken nếu đang ở route admin
        const isAdminRoute = location.pathname.startsWith('/admin');
        if (isAdminRoute) {
            const adminToken = localStorage.getItem("adminToken");
            if (adminToken) {
                try {
                    const { token, user } = JSON.parse(adminToken);
                    setToken(token);
                    setUser(user);
                    setIsAuthenticated(!!token && !!user);
                    setIsLoading(false);
                    return;
                } catch (error) {
                    console.error("Error parsing adminToken from localStorage:", error);
                    localStorage.removeItem("adminToken");
                }
            }
        }
        // Nếu không phải admin hoặc không có adminToken, lấy user thường
        const stored = localStorage.getItem("foodforum_auth")
        if (stored) {
            try {
                const { token, user } = JSON.parse(stored);
                setToken(token);
                setUser(user);
                setIsAuthenticated(!!token && !!user);
            } catch (error) {
                console.error("Error parsing auth data from localStorage:", error);
                localStorage.removeItem("foodforum_auth");
            }
        }
        setIsLoading(false);
    }, [location.pathname])

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
