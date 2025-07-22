import { useState, useEffect } from "react"
import { Search, Filter, SortAsc, Clock, User, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import categoriesApi from "../api/categories"

const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "views", label: "Lượt xem" },
    { value: "votes", label: "Lượt vote" }
]

const timeOptions = [
    { value: "all", label: "Tất cả thời gian" },
    { value: "15", label: "≤ 15 phút" },
    { value: "30", label: "≤ 30 phút" },
    { value: "45", label: "≤ 45 phút" },
    { value: "60", label: "≤ 1 giờ" },
    { value: "90", label: "≤ 1.5 giờ" },
    { value: "120", label: "≤ 2 giờ" }
]

export default function PostsFilter({
    filters,
    onFiltersChange,
    onSearch,
    className = ""
}) {
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState(filters.search || "")
    const [showFilters, setShowFilters] = useState(false)

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await categoriesApi.getAllCategories()
                setCategories(categoriesData)
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }
        loadCategories()
    }, [])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== filters.search) {
                onSearch(searchTerm)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, filters.search, onSearch])

    // State cục bộ cho input username
    const [authorUsernameInput, setAuthorUsernameInput] = useState(filters.authorUsername || "");

    // Đồng bộ lại khi filter authorUsername thay đổi từ ngoài
    useEffect(() => {
        setAuthorUsernameInput(filters.authorUsername || "");
    }, [filters.authorUsername]);

    // Debounce authorUsernameInput 3s
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (authorUsernameInput !== filters.authorUsername) {
                onFiltersChange({ ...filters, authorUsername: authorUsernameInput, page: 1 });
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [authorUsernameInput]);

    const handleFilterChange = (key, value) => {
        onFiltersChange({
            ...filters,
            [key]: value,
            page: 1 // Reset to first page when filters change
        })
    }

    const clearFilters = () => {
        onFiltersChange({
            page: 1,
            limit: 10,
            search: "",
            sort: "newest",
            categorySlugs: "",
            maxTotalTime: "",
            authorUsername: ""
        })
        setSearchTerm("")
    }

    const hasActiveFilters = filters.search || filters.categorySlugs || filters.maxTotalTime || filters.authorUsername

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Tìm kiếm bài viết, công thức..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                />
            </div>

            {/* Filter toggle and sort */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Bộ lọc
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-1">
                            {Object.values(filters).filter(v => v && v !== "newest" && v !== 10).length}
                        </Badge>
                    )}
                </Button>

                <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-gray-500" />
                    <Select
                        value={filters.sort}
                        onValueChange={(value) => handleFilterChange("sort", value)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Bộ lọc</h3>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Xóa tất cả
                            </Button>
                        )}
                    </div>

                    {/* Categories filter (dùng slug) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const isSelected = filters.categorySlugs.split(",").includes(category.slug)
                                return (
                                    <Badge
                                        key={category._id}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer ${isSelected
                                            ? "bg-orange-500 hover:bg-orange-600"
                                            : "hover:bg-orange-50"
                                            }`}
                                        onClick={() => {
                                            const currentSlugs = filters.categorySlugs.split(",").filter(Boolean)
                                            const newSlugs = currentSlugs.includes(category.slug)
                                                ? currentSlugs.filter(slug => slug !== category.slug)
                                                : [...currentSlugs, category.slug]
                                            handleFilterChange("categorySlugs", newSlugs.join(","))
                                        }}
                                    >
                                        {category.name}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    {/* Time filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Thời gian nấu tối đa
                        </label>
                        <Select
                            value={filters.maxTotalTime || "all"}
                            onValueChange={(value) => handleFilterChange("maxTotalTime", value === "all" ? "" : value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {timeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Author filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="h-4 w-4 inline mr-1" />
                            Tác giả
                        </label>
                        <Input
                            placeholder="Nhập username..."
                            value={authorUsernameInput}
                            onChange={e => setAuthorUsernameInput(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
} 