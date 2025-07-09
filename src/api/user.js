import axiosClient from './axiosClient'

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
