import axios from './axiosClient';

export const getComments = (postId, page = 1, limit = 10) =>
  axios.get('/comments', { params: { post_id: postId, page, limit } });

export const createComment = (postId, content, parentId = null) =>
  axios.post('/comments', { postId, content, parentId });

export const getCommentsByUser = (username, page = 1, limit = 10) =>
  axios.get('/comments/user-comments', { params: { commenterUsername: username, page, limit } });
