import axiosClient from './axiosClient';

const commentsApi = {
    // Get comments for a specific post
    getCommentsByPostId: async (postId) => {
        try {
            const response = await axiosClient.get(`/comments/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Create a new comment
    createComment: async (postId, commentData) => {
        try {
            const response = await axiosClient.post(`/comments/post/${postId}`, commentData);
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    // Update a comment
    updateComment: async (commentId, commentData) => {
        try {
            const response = await axiosClient.put(`/comments/${commentId}`, commentData);
            return response.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    },

    // Delete a comment
    deleteComment: async (commentId) => {
        try {
            const response = await axiosClient.delete(`/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
};

export default commentsApi;
