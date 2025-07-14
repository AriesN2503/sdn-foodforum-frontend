import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Upload, Image as ImageIcon, X } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router"
import postsApi from "../api/posts"
import categoriesApi from "../api/categories"
import { useToast } from "../components/ui/use-toast"

export default function CreatePost() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        // Recipe fields
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "",
        ingredients: "",
        instructions: ""
    })

    const loadCategories = async () => {
        try {
            const categoriesData = await categoriesApi.getAllCategories()
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error loading categories:', error)
            toast({
                title: "Error",
                description: "Failed to load categories",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        // Redirect if not authenticated
        if (!user || !token) {
            navigate("/login")
            return
        }

        loadCategories()
    }, [user, token, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            category: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Error",
                    description: "Please select an image file",
                    variant: "destructive"
                })
                return
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "Image size must be less than 5MB",
                    variant: "destructive"
                })
                return
            }

            setSelectedImage(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            })
            return
        }

        setLoading(true)

        try {
            const postData = new FormData()
            postData.append('title', formData.title.trim())
            postData.append('content', formData.content.trim())
            postData.append('category', formData.category)

            // Add recipe fields if provided
            if (formData.prepTime.trim()) {
                postData.append('recipe.prepTime', formData.prepTime.trim())
            }
            if (formData.cookTime.trim()) {
                postData.append('recipe.cookTime', formData.cookTime.trim())
            }
            if (formData.servings.trim()) {
                postData.append('recipe.servings', formData.servings.trim())
            }
            if (formData.difficulty) {
                postData.append('recipe.difficulty', formData.difficulty)
            }
            if (formData.ingredients.trim()) {
                postData.append('ingredients', formData.ingredients.trim())
            }
            if (formData.instructions.trim()) {
                postData.append('instructions', formData.instructions.trim())
            }

            if (selectedImage) {
                postData.append('image', selectedImage)
            }

            await postsApi.createPost(postData)

            toast({
                title: "Success",
                description: "Post created successfully!",
                variant: "default"
            })

            navigate("/")
        } catch (error) {
            console.error('Error creating post:', error)
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create post",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    if (!user || !token) {
        return null // Will redirect
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter your post title"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select onValueChange={handleCategoryChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            <span className="flex items-center gap-2">
                                                <span>{category.icon}</span>
                                                <span>{category.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Share your food experience, recipe, or story..."
                                className="w-full min-h-[120px]"
                                required
                            />
                        </div>

                        {/* Recipe Section */}
                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">Recipe Details (Optional)</h3>

                            {/* Recipe Time and Servings */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prepTime">Prep Time</Label>
                                    <Input
                                        id="prepTime"
                                        name="prepTime"
                                        value={formData.prepTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 15 minutes"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cookTime">Cook Time</Label>
                                    <Input
                                        id="cookTime"
                                        name="cookTime"
                                        value={formData.cookTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 30 minutes"
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="servings">Servings</Label>
                                    <Input
                                        id="servings"
                                        name="servings"
                                        value={formData.servings}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 4 people"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ingredients */}
                            <div className="space-y-2">
                                <Label htmlFor="ingredients">Ingredients</Label>
                                <Textarea
                                    id="ingredients"
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleInputChange}
                                    placeholder="Enter each ingredient on a new line:&#10;• 2 cups flour&#10;• 1 cup sugar&#10;• 3 eggs"
                                    className="w-full min-h-[100px]"
                                />
                            </div>

                            {/* Instructions */}
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    placeholder="Enter each step on a new line:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
                                    className="w-full min-h-[120px]"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Image (Optional)</Label>
                            {!imagePreview ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="image" className="cursor-pointer">
                                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600">
                                            Click to upload an image or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                            >
                                {loading ? "Creating..." : "Create Post"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
