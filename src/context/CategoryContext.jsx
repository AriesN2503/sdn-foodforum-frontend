import { useState } from 'react'
import CategoryContext from './CategoryContextInstance'

export { CategoryContext }

export const CategoryProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState('New')

    const selectCategory = (categoryName) => {
        setSelectedCategory(categoryName)
    }

    const value = {
        selectedCategory,
        selectCategory
    }

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}
