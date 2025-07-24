import { createContext, useState } from 'react'

export const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState('Phổ Biến')

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
