import axiosClient from './axiosClient'

export const register = async (data) => {
    try {
        const response = await axiosClient.post('/auth/register', data)
        return response.data
    } catch (error) {
        console.error('Register error:', error);
        if (error.response) {
            console.error('Register error response:', error.response.data);
        }
        throw error
    }
}

export const login = async (email, password) => {
    try {
        const response = await axiosClient.post('/auth/login', { email, password })
        return response.data
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
            console.error('Login error response:', error.response.data);
        }
        throw error
    }
}

export const refreshToken = async () => {
    const response = await axiosClient.post('/auth/refresh-token', {}, { withCredentials: true })
    return response.data
}

export const logout = async () => {
    const response = await axiosClient.post('/auth/logout', {}, { withCredentials: true })
    return response.data
}
