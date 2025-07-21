import axiosClient from './axiosClient';

// Lấy danh sách bài post
export const getPosts = (params = {}) => {
  // params: { page, limit, tag, search }
  return axiosClient.get('/posts', { params });
};

// Lấy chi tiết bài post
export const getPostById = (id) => {
  return axiosClient.get(`/posts/${id}`);
};

// Tạo bài post (formData nếu có ảnh, JSON nếu không)
export const createPost = (data) => {
  // data: FormData hoặc object thường
  const isFormData = data instanceof FormData;
  return axiosClient.post('/posts', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
};

// Cập nhật bài post
export const updatePost = (id, data) => {
  const isFormData = data instanceof FormData;
  return axiosClient.put(`/posts/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
};

// Xóa bài post (soft delete)
export const deletePost = (id) => {
  return axiosClient.delete(`/posts/${id}`);
};

// Lấy bài post theo user
export const getPostsByUser = (userId) => {
  return axiosClient.get(`/posts/user/${userId}`);
};

// Tăng view cho bài post
export const increaseView = (id) => {
  return axiosClient.post(`/posts/${id}/view`);
};

// Lấy bài post theo tag
export const getPostsByTag = (tag) => {
  return axiosClient.get(`/posts/tag/${tag}`);
}; 