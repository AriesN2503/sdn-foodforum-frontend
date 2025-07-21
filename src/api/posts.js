import axiosClient from './axiosClient';

const postsApi = {
    // Get all posts
    getAllPosts: async () => {
        try {
            const response = await axiosClient.get('/posts');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    // Get a single post by ID
    getPostById: async (id) => {
        try {
            const response = await axiosClient.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            const response = await axiosClient.post('/posts', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Update a post
    updatePost: async (id, postData) => {
        try {
            const response = await axiosClient.put(`/posts/${id}`, postData);
            return response.data;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },

    // Delete a post
    deletePost: async (id) => {
        try {
            const response = await axiosClient.delete(`/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },

    // Get posts by user
    getPostsByUser: async (userId) => {
        try {
            const response = await axiosClient.get(`/posts/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    },

    // Get posts by category
    getPostsByCategory: async (categoryId) => {
        try {
            const response = await axiosClient.get(`/posts/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts by category:', error);
            throw error;
        }
    },

    // Get posts by filter (hot, new, top)
    getPostsByFilter: async (filter) => {
        try {
            const response = await axiosClient.get(`/posts/filter?filter=${filter}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered posts:', error);
            throw error;
        }
    }
};

export default postsApi;
