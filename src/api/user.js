import axiosClient from './axiosClient';

export const getUsers = async () => {
    const response = await axiosClient.get('/users')
    return response.data
}

export const getUserById = async (id) => {
    const response = await axiosClient.get(`/users/${id}`)
    return response.data
}

export const updateUser = async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData)
    return response.data
}

export const deleteUser = async (id) => {
    const response = await axiosClient.delete(`/users/${id}`)
    return response.data
}

export const getCurrentUser = async () => {
    const response = await axiosClient.get('/users/me')
    return response.data
}

export const updateUserStatus = async (id, status) => {
    const response = await axiosClient.patch(`/users/${id}/status`, { status });
    return response.data;
}

export const getUserFavoritePosts = async () => {
    const response = await axiosClient.get('/users/me/favorites')
    return response.data
}

export const addToFavorites = async (postId) => {
    const response = await axiosClient.post(`/users/me/favorites/${postId}`)
    return response.data
}

export const removeFromFavorites = async (postId) => {
    const response = await axiosClient.delete(`/users/me/favorites/${postId}`)
    return response.data
}

export const getCurrentUserPosts = async () => {
    const response = await axiosClient.get('/users/me/posts');
    return response.data;
}

export async function uploadAvatarToFirebase(file, userId) {
    if (!file || !userId) throw new Error('File and userId are required');
    const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
    await uploadBytes(avatarRef, file);
    return await getDownloadURL(avatarRef);
}

export const updateUserProfile = async (userId, data) => {
    const response = await axiosClient.put(`/users/${userId}`, data);
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    const response = await axiosClient.patch(`/users/${userId}/change-password`, { oldPassword, newPassword });
    return response.data;
};


export const getMe = () => axiosClient.get('/users/me');
export const getUserProfile = (username) => axiosClient.get(`/users/profile/${username}`);

// Gửi lời mời kết bạn
export const sendFriendRequest = async (userId) => {
    const response = await axiosClient.post(`/users/${userId}/send-friend-request`, { to: userId });
    return response.data;
};

// Lấy danh sách lời mời kết bạn
export const getFriendRequests = async () => {
    const response = await axiosClient.get('/users/friend-requests');
    return response.data;
};

// Phản hồi lời mời kết bạn
export const respondFriendRequest = async (requestId, action) => {
    const response = await axiosClient.post('/users/respond-friend-request', { requestId, action });
    return response.data;
};

// Lấy danh sách bạn bè của user
export const getFriendsByUserId = async (userId) => {
    const response = await axiosClient.get(`/users/${userId}/friends`);
    return response.data;
};

