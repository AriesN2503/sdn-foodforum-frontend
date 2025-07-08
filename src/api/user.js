import axiosClient from './axiosClient'

// Fetch all users
export const getUsers = async () => {
    const response = await axiosClient.get('/users')
    return response.data
}

// Fetch a user by ID
export const getUserById = async (id) => {
    const response = await axiosClient.get(`/users/${id}`)
    return response.data
}

// Update a user by ID
export const updateUser = async (id, userData) => {
    const response = await axiosClient.put(`/users/${id}`, userData)
    return response.data
}

// Delete a user by ID
export const deleteUser = async (id) => {
    const response = await axiosClient.delete(`/users/${id}`)
    return response.data
}
