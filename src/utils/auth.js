// Authentication utilities
export const AUTH_STORAGE_KEY = "foodforum_auth"

// Mock users database
const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    email: "admin@foodforum.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    username: "moderator",
    email: "mod@foodforum.com",
    password: "mod123",
    role: "moderator",
  },
  {
    id: 3,
    username: "user1",
    email: "user@foodforum.com",
    password: "user123",
    role: "user",
  },
  {
    id: 4,
    username: "foodlover",
    email: "foodlover@foodforum.com",
    password: "food123",
    role: "user",
  },
]

// Get stored auth data
export const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Error parsing stored auth:", error)
    return null
  }
}

// Store auth data
export const storeAuth = (authData) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
  } catch (error) {
    console.error("Error storing auth:", error)
  }
}

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

// Mock login function
export const mockLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
      if (user) {
        const authData = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          token: `mock_token_${user.id}_${Date.now()}`,
        }
        resolve(authData)
      } else {
        reject(new Error("Email hoặc mật khẩu không đúng"))
      }
    }, 1000)
  })
}

// Mock register function
export const mockRegister = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = MOCK_USERS.find((u) => u.email === email || u.username === username)
      if (existingUser) {
        reject(new Error("Email hoặc tên người dùng đã tồn tại"))
      } else {
        const newUser = {
          id: MOCK_USERS.length + 1,
          username,
          email,
          password,
          role: "user",
        }
        MOCK_USERS.push(newUser)
        resolve({ message: "Đăng ký thành công" })
      }
    }, 1000)
  })
}

// Check if user has required role
export const checkRole = (userRole, requiredRole) => {
  const roleHierarchy = { user: 1, moderator: 2, admin: 3 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const auth = getStoredAuth()
  return auth && auth.user && auth.token
}
