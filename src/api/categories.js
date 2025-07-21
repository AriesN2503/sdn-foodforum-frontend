import axiosClient from './axiosClient';

const categoriesApi = {
    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await axiosClient.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get category by ID
    getCategoryById: async (id) => {
        try {
            const response = await axiosClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Create new category
    createCategory: async (categoryData) => {
        try {
            const response = await axiosClient.post('/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    // Update category
    updateCategory: async (id, categoryData) => {
        try {
            const response = await axiosClient.put(`/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // Delete category
    deleteCategory: async (id) => {
        try {
            const response = await axiosClient.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default categoriesApi;
