import axiosClient from './axiosClient'
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getUsers = async () => {
    const response = await axiosClient.get('/users')
    return response.data
}

export const getUserById = async (id) => {
    const response = await axiosClient.get(`/users/${id}`)
    return response.data
}

export const updateUser = async (id, userData) => {
    if (!id) {
        throw new Error('User ID is required for update');
    }
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

// Moderator functions
export const getAllUsers = async () => {
    const response = await axiosClient.get('/users/all');
    return response.data;
}

export const updateUserStatus = async (userId, status) => {
    const response = await axiosClient.put(`/users/${userId}/status`, { status });
    return response.data;
}

export const updateUserRole = async (userId, role) => {
    const response = await axiosClient.put(`/users/${userId}/role`, { role });
    return response.data;
}
