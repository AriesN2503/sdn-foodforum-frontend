import axiosClient from './axiosClient';

const postsApi = {
    // Lấy tất cả bài post (chỉ approved, hoặc tất cả nếu là admin)
    getAllPosts: async (params = {}) => {
        try {
            const { allStatus = false, ...rest } = params;
            let url = '/posts';
            const queryParams = new URLSearchParams();
            if (allStatus) queryParams.append('allStatus', 'true');
            Object.entries(rest).forEach(([key, value]) => {
                if (value !== undefined && value !== null) queryParams.append(key, value);
            });
            if (queryParams.toString()) url += `?${queryParams.toString()}`;
            console.log('url: ', url)
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

    // Lấy tất cả bài post của một user (cả approved, pending, rejected)
    getUserPosts: async (userId) => {
        try {
            const response = await axiosClient.get(`/posts/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    },

    // Lấy bài post của user theo status
    getUserPostsByStatus: async (userId, status) => {
        try {
            const response = await axiosClient.get(`/posts/user/${userId}?status=${status}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user posts by status:', error);
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
    },

    // Duyệt bài post
    approvePost: async (postId) => {
        try {
            const response = await axiosClient.patch(`/posts/${postId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving post:', error);
            throw error;
        }
    },
    // Từ chối bài post
    rejectPost: async (postId, reason) => {
        try {
            const response = await axiosClient.patch(`/posts/${postId}/reject`, reason ? { reason } : {});
            return response.data;
        } catch (error) {
            console.error('Error rejecting post:', error);
            throw error;
        }
    }
};

export default postsApi;
