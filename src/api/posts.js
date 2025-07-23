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

    // Search posts
    searchPosts: async (query) => {
        try {
            // On a real backend, this would be a proper search endpoint
            // But for now, we'll fetch all posts and filter client-side
            const response = await axiosClient.get('/posts');
            const posts = response.data;

            // Filter posts that contain the search query in title or content
            const searchTermLower = query.toLowerCase();
            return posts.filter(post =>
                post.title?.toLowerCase().includes(searchTermLower) ||
                post.content?.toLowerCase().includes(searchTermLower) ||
                post.author?.username?.toLowerCase().includes(searchTermLower) ||
                post.category?.name?.toLowerCase().includes(searchTermLower)
            );
        } catch (error) {
            console.error('Error searching posts:', error);
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

    // Get posts by user and status
    getPostsByUserAndStatus: async (userId, status) => {
        try {
            const response = await axiosClient.get(`/posts/user/${userId}/status/${status}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user's ${status} posts:`, error);
            throw error;
        }
    },

    // Get current user's posts
    getMyPosts: async () => {
        try {
            const response = await axiosClient.get('/posts/user/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user posts:', error);
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
    },

    // Get reported posts for moderators
    getReportedPosts: async () => {
        try {
            const response = await axiosClient.get('/posts/reported');
            return response.data;
        } catch (error) {
            console.error('Error fetching reported posts:', error);
            throw error;
        }
    },

    // Get pending posts for moderators
    getPendingPosts: async () => {
        try {
            const response = await axiosClient.get('/posts/pending');
            return response.data;
        } catch (error) {
            console.error('Error fetching pending posts:', error);
            throw error;
        }
    },

    // Get posts by status (pending, approved, rejected)
    getPostsByStatus: async (status) => {
        try {
            const response = await axiosClient.get(`/posts/status/${status}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${status} posts:`, error);
            throw error;
        }
    },

    // Approve a reported post (moderator action)
    approvePost: async (id) => {
        try {
            const response = await axiosClient.put(`/posts/${id}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving post:', error);
            throw error;
        }
    },

    // Reject a reported post (moderator action)
    rejectPost: async (id, reason) => {
        try {
            const response = await axiosClient.put(`/posts/${id}/reject`, { reason });
            return response.data;
        } catch (error) {
            console.error('Error rejecting post:', error);
            throw error;
        }
    }
};

export default postsApi;
