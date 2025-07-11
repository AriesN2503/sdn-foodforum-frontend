import { Outlet } from "react-router"
import Header from "../components/Header"
import { CategoriesSidebar } from "../components/CategoriesSidebar"
import { TrendingSidebar } from "../components/TrendingSidebar"

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto grid grid-cols-18 gap-6 p-4 items-start justify-between">
        {/* Fixed width sidebar - 2 columns */}
        <div className="col-span-4">
          <CategoriesSidebar />
        </div>

        {/* Main content area - 7 columns, fixed width */}
        <div className="col-span-9">
          <Outlet />
        </div>

        {/* Fixed width sidebar - 3 columns */}
        <div className="col-span-5">
          <TrendingSidebar />
        </div>
      </div>
    </div>
  )
}

export default MainLayout