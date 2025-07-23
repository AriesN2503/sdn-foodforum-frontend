import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { AuthLayout } from "../layout/AuthLayout"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { register as registerApi } from '../api/auth'
import { useToast } from "../context/ToastContext"

export default function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { showToast } = useToast()

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

        if (!formData.username) {
            newErrors.username = "Username is required"
        } else if (formData.username.length < 3) {
            newErrors.username = "Must be at least 3 characters"
        }

        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Must be at least 8 characters"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms"
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
            await registerApi({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            })
            navigate("/login")
            showToast("Register successful", { type: "success", duration: 3000 })
        } catch (error) {
            setErrors({ general: error?.response?.data?.error || error.message || "Something went wrong. Try again." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout title="Create an account" subtitle="Join the FoodForum community">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded text-sm">
                        {errors.general}
                    </div>
                )}

                {/* Username */}
                <div>
                    <Label htmlFor="username" className="mb-1 block text-sm font-medium">
                        Username
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                            placeholder="Your Username"
                        />
                    </div>
                    {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email" className="mb-1 block text-sm font-medium">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                            placeholder="your@email.com"
                        />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password" className="mb-1 block text-sm font-medium">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                            placeholder="Create password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <Label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                            placeholder="Repeat password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-400"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
                        }
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-5">
                        I agree to the{" "}
                        <a href="/terms" className="text-orange-500 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-orange-500 hover:underline">
                            Privacy Policy
                        </a>
                    </Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                {/* Already have account */}
                <div className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-orange-500 hover:underline font-medium">
                        Sign in here
                    </a>
                </div>
            </form>
        </AuthLayout>
    )
}
