import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange,
    className = "" 
}) {
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        
        if (totalPages <= maxVisiblePages) {
            // Hiển thị tất cả các trang nếu tổng số trang <= 5
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Logic hiển thị trang với ellipsis
            if (currentPage <= 3) {
                // Trang đầu: 1, 2, 3, 4, ..., totalPages
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                // Trang cuối: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Trang giữa: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
                pages.push(1)
                pages.push('...')
                pages.push(currentPage - 1)
                pages.push(currentPage)
                pages.push(currentPage + 1)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Previous button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
            >
                <ChevronLeft className="h-4 w-4" />
                Trước
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <div key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`min-w-[40px] ${
                                    currentPage === page 
                                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                                        : "hover:bg-orange-50 hover:border-orange-300"
                                }`}
                            >
                                {page}
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Next button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
            >
                Tiếp
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
} 