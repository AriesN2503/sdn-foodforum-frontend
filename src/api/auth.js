import axiosClient from './axiosClient'

export const register = async (userData) => {
    const response = await axiosClient.post('/auth/register', userData)
    return response.data
}

export const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password }, { withCredentials: true })
    return response.data
}

export const refreshToken = async () => {
    const response = await axiosClient.post('/auth/refresh-token', {}, { withCredentials: true })
    return response.data
}

export const logout = async () => {
    const response = await axiosClient.post('/auth/logout', {}, { withCredentials: true })
    return response.data
}
