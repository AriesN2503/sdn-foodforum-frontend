import { Lock, User } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { AuthLayout } from "../layout/AuthLayout"

export default function AdminLogin() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.password) newErrors.password = "Password is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        try {
            console.log(formData)
            // const res = await login(formData.email, formData.password)
            // console.log(res)
            navigate('/')
            toast.success("Login successful!")
        } catch (err) {
            const message = err?.response?.data?.error || "Invalid admin credentials"
            setErrors({ general: message })
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout title="Admin Login" subtitle="Access the admin dashboard securely">
            <Card className="w-full max-w-md mx-auto border-none shadow-none p-0 py-10 gap-10 pt-5">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-orange-600 font-bold">Admin Portal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                                {errors.general}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter admin email"
                                    className="pl-10"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    className="pl-10"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    )
}
