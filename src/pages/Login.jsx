import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { AuthLayout } from "../layout/AuthLayout"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { login as loginApi } from '../api/auth'
import { AUTH_STORAGE_KEY } from '../utils/auth'
import { jwtDecode } from "jwt-decode"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        setErrors({})
        try {
            const data = await loginApi(formData.email, formData.password)
            // Decode JWT để lấy thông tin user
            let user = data.user || {};
            if (data.accessToken) {
                try {
                    const decoded = jwtDecode(data.accessToken);
                    user = { ...user, ...decoded };
                    await login(data.accessToken, user)
                } catch (err) {
                    console.error('JWT decode error:', err);
                }
            }
            // Store user and token in localStorage for AuthContext compatibility
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({
                    user,
                    token: data.accessToken,
                })
            )
            navigate("/")
        } catch (err) {
            setErrors({ general: err?.response?.data?.error || err.message || "Invalid email or password" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your FoodForum account">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {errors.general}
                    </div>
                )}

                {/* Email */}
                <div>
                    <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Email address
                    </Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Mail className="h-4 w-4" />
                        </span>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className={`pl-10 ${errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}`}
                        />
                    </div>
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <Lock className="h-4 w-4" />
                        </span>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className={`pl-10 pr-10 ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}`}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me + Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({ ...prev, rememberMe: checked }))
                            }
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                            Remember me
                        </Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                        Forgot password?
                    </Link>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>

                {/* Social login */}
                <div className="mt-6">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>
                </div>

                {/* Register */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}
