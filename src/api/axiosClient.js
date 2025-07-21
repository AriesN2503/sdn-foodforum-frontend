import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL ? import.meta.env.VITE_APP_API_URL + "/api" : "http://localhost:8080/api",
    withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("foodforum_auth") ? JSON.parse(localStorage.getItem("foodforum_auth")).token : null
    const tokenAdmin = localStorage.getItem("adminToken") ? JSON.parse(localStorage.getItem("adminToken")).token : null
    if (tokenAdmin) {
        config.headers["Authorization"] = `Bearer ${tokenAdmin}`
    } else if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosClient