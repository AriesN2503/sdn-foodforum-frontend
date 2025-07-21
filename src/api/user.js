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

export async function uploadAvatarToFirebase(file, userId) {
    if (!file || !userId) throw new Error('File and userId are required');
    const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
    await uploadBytes(avatarRef, file);
    return await getDownloadURL(avatarRef);
}



export const getMe = () => axiosClient.get('/users/me');
export const getUserProfile = (username) => axiosClient.get(`/users/profile/${username}`);

