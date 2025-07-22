import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Plus, Trash2, Upload } from "lucide-react"
import { useNavigate } from "react-router"
import postsApi from "../api/posts"
import { useToast } from "../components/ui/use-toast"
import axiosClient from "../api/axiosClient"
import categoriesApi from "../api/categories"
import Select from "react-select"

async function uploadImage(file, token) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosClient.post("/upload/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    });
    return res.data.imageUrl;
}

export default function CreatePost() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState({}) // {thumbnail: false, ingredient-0: false, instruction-0: false, ...}
    const [categories, setCategories] = useState([])
    const [categoryError, setCategoryError] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnailUrl: "",
        categoryIds: [],
        prepTimeMinutes: "",
        cookTimeMinutes: "",
        servings: "",
        notes: "",
        ingredients: [
            { name: "", quantity: "", imageUrl: "" }
        ],
        instructions: [
            { stepNumber: 1, stepDescription: "", imageUrl: "" }
        ]
    })

    useEffect(() => {
        console.log('abc')
        const fetchCategories = async () => {
            try {
                const data = await categoriesApi.getAllCategories()
                setCategories(data)
            } catch {
                toast({ title: "Lỗi", description: "Không thể tải danh mục", variant: "destructive" })
            }
        }
        fetchCategories()
    }, [])

    // Lấy token từ localStorage (giả định đã login)
    const token = JSON.parse(localStorage.getItem("foodforum_auth"))?.token;
    const userId = JSON.parse(localStorage.getItem("foodforum_auth"))?.user?.id;

    // Xử lý thay đổi trường cơ bản
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Xử lý upload ảnh thumbnail
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, thumbnail: true }));
        try {
            const url = await uploadImage(file, token);
            setFormData(prev => ({ ...prev, thumbnailUrl: url }));
            toast({ title: "Thành công", description: "Tải ảnh thành công!", variant: "default" });
        } catch {
            toast({ title: "Lỗi", description: "Tải ảnh thất bại!", variant: "destructive" });
        } finally {
            setUploading(prev => ({ ...prev, thumbnail: false }));
        }
    }

    // Xử lý upload ảnh nguyên liệu
    const handleIngredientImageUpload = async (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, ["ingredient-" + idx]: true }));
        try {
            const url = await uploadImage(file, token);
            setFormData(prev => {
                const ingredients = [...prev.ingredients];
                ingredients[idx].imageUrl = url;
                return { ...prev, ingredients };
            });
            toast({ title: "Thành công", description: "Tải ảnh thành công!", variant: "default" });
        } catch {
            toast({ title: "Lỗi", description: "Tải ảnh thất bại!", variant: "destructive" });
        } finally {
            setUploading(prev => ({ ...prev, ["ingredient-" + idx]: false }));
        }
    }

    // Xử lý upload ảnh hướng dẫn
    const handleInstructionImageUpload = async (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, ["instruction-" + idx]: true }));
        try {
            const url = await uploadImage(file, token);
            setFormData(prev => {
                const instructions = [...prev.instructions];
                instructions[idx].imageUrl = url;
                return { ...prev, instructions };
            });
            toast({ title: "Thành công", description: "Tải ảnh thành công!", variant: "default" });
        } catch {
            toast({ title: "Lỗi", description: "Tải ảnh thất bại!", variant: "destructive" });
        } finally {
            setUploading(prev => ({ ...prev, ["instruction-" + idx]: false }));
        }
    }

    // Xử lý thay đổi nguyên liệu
    const handleIngredientChange = (idx, field, value) => {
        setFormData(prev => {
            const ingredients = [...prev.ingredients]
            ingredients[idx][field] = value
            return { ...prev, ingredients }
        })
    }

    // Thêm nguyên liệu
    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: "", quantity: "", imageUrl: "" }]
        }))
    }

    // Xóa nguyên liệu
    const removeIngredient = (idx) => {
        setFormData(prev => {
            const ingredients = prev.ingredients.filter((_, i) => i !== idx)
            return { ...prev, ingredients }
        })
    }

    // Xử lý thay đổi hướng dẫn
    const handleInstructionChange = (idx, field, value) => {
        setFormData(prev => {
            const instructions = [...prev.instructions]
            instructions[idx][field] = value
            if (field === "stepDescription" && !instructions[idx].stepNumber) {
                instructions[idx].stepNumber = idx + 1
            }
            return { ...prev, instructions }
        })
    }

    // Thêm hướng dẫn
    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, { stepNumber: prev.instructions.length + 1, stepDescription: "", imageUrl: "" }]
        }))
    }

    // Xóa hướng dẫn
    const removeInstruction = (idx) => {
        setFormData(prev => {
            const instructions = prev.instructions.filter((_, i) => i !== idx)
            // Cập nhật lại số thứ tự bước
            instructions.forEach((ins, i) => ins.stepNumber = i + 1)
            return { ...prev, instructions }
        })
    }

    // Xử lý chọn category (multi-select)
    const handleCategoryChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value)
        setFormData(prev => ({ ...prev, categoryIds: selected }))
        if (selected.length < 1) setCategoryError("Vui lòng chọn ít nhất 1 danh mục.")
        else if (selected.length > 3) setCategoryError("Chỉ được chọn tối đa 3 danh mục.")
        else setCategoryError("")
    }

    // Helper để chuyển categories sang options cho react-select
    const categoryOptions = categories.map(cat => ({
      value: cat._id,
      label: cat.name,
      imageUrl: cat.imageUrl
    }))

    // Custom option hiển thị ảnh + tên
    const formatCategoryOption = (option) => {
      const data = option.data || option;
      return (
        <div className="flex items-center gap-2">
          <span>{data.label}</span>
        </div>
      );
    }

    // Xử lý submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim() || !formData.thumbnailUrl.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Mô tả, Ảnh đại diện, Danh mục)",
                variant: "destructive"
            })
            return
        }
        if (formData.categoryIds.length < 1) {
            setCategoryError("Vui lòng chọn ít nhất 1 danh mục.")
            return
        }
        if (formData.categoryIds.length > 3) {
            setCategoryError("Chỉ được chọn tối đa 3 danh mục.")
            return
        }
        setCategoryError("")
        if (!userId) {
            toast({ title: "Lỗi", description: "Không xác định được người dùng!", variant: "destructive" });
            return;
        }
        setLoading(true)
        try {
            const response = await postsApi.createPost({
                ...formData,
                author: userId,
                prepTimeMinutes: Number(formData.prepTimeMinutes) || 0,
                cookTimeMinutes: Number(formData.cookTimeMinutes) || 0,
                servings: Number(formData.servings) || 0,
                categories: formData.categoryIds,
                ingredients: JSON.stringify(formData.ingredients),
                instructions: JSON.stringify(formData.instructions)
            })
            toast({
                title: "Thành công",
                description: "Bài viết đã được tạo thành công!",
                variant: "default"
            })
            // Chuyển hướng sang trang chi tiết post
            if (response && response.post && response.post.slug) {
                navigate(`/posts/${response.post.slug}`)
            } else {
            navigate("/")
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error.response?.data?.message || "Không thể tạo bài viết",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#FF6900] text-center">Tạo Bài Viết Mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tiêu đề */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề *</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Nhập tiêu đề bài viết" required />
                        </div>
                        {/* Mô tả */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Nhập mô tả ngắn cho bài viết" required />
                        </div>
                        {/* Ảnh đại diện */}
                        <div className="space-y-2">
                            <Label>Ảnh đại diện *</Label>
                            <div className="flex items-center gap-4">
                                <Button asChild type="button" variant="outline" disabled={uploading.thumbnail}>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Upload className="w-4 h-4" />
                                        {uploading.thumbnail ? "Đang tải..." : "Tải ảnh lên"}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                                    </label>
                                </Button>
                                {formData.thumbnailUrl && <img src={formData.thumbnailUrl} alt="thumbnail" className="h-20 w-20 object-cover rounded" />}
                            </div>
                        </div>
                        {/* Danh mục */}
                        <div className="space-y-2">
                            <Label htmlFor="categoryIds">Danh mục *</Label>
                            <Select
                                inputId="categoryIds"
                                isMulti
                                options={categoryOptions}
                                value={categoryOptions.filter(opt => formData.categoryIds.includes(opt.value))}
                                onChange={selected => {
                                  const ids = selected.map(opt => opt.value)
                                  setFormData(prev => ({ ...prev, categoryIds: ids }))
                                  if (ids.length < 1) setCategoryError("Vui lòng chọn ít nhất 1 danh mục.")
                                  else if (ids.length > 3) setCategoryError("Chỉ được chọn tối đa 3 danh mục.")
                                  else setCategoryError("")
                                }}
                                closeMenuOnSelect={false}
                                placeholder="Chọn danh mục..."
                                maxMenuHeight={200}
                                isOptionDisabled={option => formData.categoryIds.length >= 3 && !formData.categoryIds.includes(option.value)}
                                formatOptionLabel={formatCategoryOption}
                                classNamePrefix="react-select"
                            />
                            <div className="text-xs text-gray-500">Chọn tối đa 3 danh mục</div>
                            {categoryError && <div className="text-red-500 text-sm mt-1">{categoryError}</div>}
                        </div>
                        {/* Thời gian chuẩn bị, nấu, khẩu phần */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prepTimeMinutes">Thời gian chuẩn bị (phút)</Label>
                                <Input id="prepTimeMinutes" name="prepTimeMinutes" type="number" min="0" value={formData.prepTimeMinutes} onChange={handleChange} placeholder="VD: 15" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cookTimeMinutes">Thời gian nấu (phút)</Label>
                                <Input id="cookTimeMinutes" name="cookTimeMinutes" type="number" min="0" value={formData.cookTimeMinutes} onChange={handleChange} placeholder="VD: 30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="servings">Khẩu phần</Label>
                                <Input id="servings" name="servings" type="number" min="1" value={formData.servings} onChange={handleChange} placeholder="VD: 4" />
                            </div>
                        </div>
                        {/* Nguyên liệu */}
                        <div className="space-y-2">
                            <Label>Nguyên liệu</Label>
                            {formData.ingredients.map((ing, idx) => (
                                <div key={idx} className="flex gap-2 items-center mb-2">
                                    <Input placeholder="Tên nguyên liệu" value={ing.name} onChange={e => handleIngredientChange(idx, "name", e.target.value)} className="w-1/3" />
                                    <Input placeholder="Số lượng" value={ing.quantity} onChange={e => handleIngredientChange(idx, "quantity", e.target.value)} className="w-1/3" />
                                    <Button asChild type="button" variant="outline" disabled={uploading["ingredient-" + idx]} className="w-1/3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            {uploading["ingredient-" + idx] ? "Đang tải..." : "Tải ảnh"}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleIngredientImageUpload(idx, e)} />
                                    </label>
                                    </Button>
                                    {ing.imageUrl && <img src={ing.imageUrl} alt="ingredient" className="h-12 w-12 object-cover rounded" />}
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeIngredient(idx)} disabled={formData.ingredients.length === 1}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addIngredient} className="mt-1"><Plus className="w-4 h-4 mr-1" />Thêm nguyên liệu</Button>
                        </div>
                        {/* Hướng dẫn */}
                        <div className="space-y-2">
                            <Label>Hướng dẫn</Label>
                            {formData.instructions.map((ins, idx) => (
                                <div key={idx} className="flex gap-2 items-center mb-2">
                                    <Input placeholder={`Bước ${idx + 1}`} value={ins.stepNumber} disabled className="w-1/6" />
                                    <Input placeholder="Mô tả bước" value={ins.stepDescription} onChange={e => handleInstructionChange(idx, "stepDescription", e.target.value)} className="w-3/6" />
                                    <Button asChild type="button" variant="outline" disabled={uploading["instruction-" + idx]} className="w-2/6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            {uploading["instruction-" + idx] ? "Đang tải..." : "Tải ảnh"}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleInstructionImageUpload(idx, e)} />
                                        </label>
                                    </Button>
                                    {ins.imageUrl && <img src={ins.imageUrl} alt="instruction" className="h-12 w-12 object-cover rounded" />}
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeInstruction(idx)} disabled={formData.instructions.length === 1}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addInstruction} className="mt-1"><Plus className="w-4 h-4 mr-1" />Thêm bước hướng dẫn</Button>
                        </div>
                        {/* Ghi chú */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Ghi chú</Label>
                            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Ghi chú thêm (nếu có)" />
                        </div>
                        {/* Nút submit */}
                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                                {loading ? "Đang tạo..." : "Tạo Bài Viết"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate("/")}>Hủy</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
