import { Outlet } from "react-router"
import Header from "../components/Header"
import { CategoriesSidebar } from "../components/CategoriesSidebar"
import { TrendingSidebar } from "../components/TrendingSidebar"
import { CategoryProvider } from "../context/CategoryContext"
import { useCategory } from "../hooks/useCategory"
import AIChatButton from "../components/AIChatButton"

const MainLayoutContent = () => {
  const { selectedCategory, selectCategory } = useCategory()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AIChatButton />
      <div className="max-w-7xl mx-auto grid grid-cols-18 gap-6 p-4 items-start justify-between">
        {/* Fixed width sidebar - 2 columns - STICKY */}
        <div className="col-span-4 sticky top-5 self-start max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide pb-8 pr-2">
          <CategoriesSidebar
            selectedCategory={selectedCategory}
            onCategorySelect={selectCategory}
          />
        </div>

        {/* Main content area - 7 columns, fixed width */}
        <div className="col-span-9">
          <Outlet />
        </div>

        {/* Fixed width sidebar - 3 columns - STICKY */}
        <div className="col-span-5 sticky top-5 self-start max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide pb-8 pl-2">
          <TrendingSidebar />
        </div>
      </div>
    </div>
  )
}

const MainLayout = () => {
  return (
    <CategoryProvider>
      <MainLayoutContent />
    </CategoryProvider>
  )
}

export default MainLayout