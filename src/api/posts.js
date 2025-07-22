import axiosClient from './axiosClient';

const postsApi = {
    // Get all posts with pagination, search, sort, and filters
    getAllPosts: async (params = {}) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                sort = 'newest',
                categorySlugs = '',
                maxTotalTime = '',
                authorUsername = ''
            } = params;

            console.log('params: ', params);

            // Build query string
            const queryParams = new URLSearchParams();
            if (page) queryParams.append('page', page);
            if (limit) queryParams.append('limit', limit);
            if (search) queryParams.append('search', search);
            if (sort) queryParams.append('sort', sort);
            if (categorySlugs) queryParams.append('categorySlugs', categorySlugs);
            if (maxTotalTime) queryParams.append('maxTotalTime', maxTotalTime);
            if (authorUsername) queryParams.append('authorUsername', authorUsername);

            const queryString = queryParams.toString();
            const url = `/posts${queryString ? `?${queryString}` : ''}`;

            console.log('url: ', url);
            
            const response = await axiosClient.get(url);
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

    // Get a single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await axiosClient.get(`posts/slugs/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post by slug:', error);
            throw error;
        }
    }
};

export default postsApi;
