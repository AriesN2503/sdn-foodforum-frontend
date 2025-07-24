import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { AuthLayout } from "../layout"
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
                } catch (err) {
                    console.error('JWT decode error:', err);
                }
            }

            // Store user and token in localStorage for AuthContext compatibility
            login(data.accessToken, user)
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
