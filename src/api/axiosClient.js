import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {}
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    const tokenAdmin = localStorage.getItem("adminToken")
    if (tokenAdmin) {
        config.headers["Authorization"] = `Bearer ${tokenAdmin}`
    } else if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
},
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosClient