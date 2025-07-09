import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
    const auth = localStorage.getItem("foodforum_auth");
    let token = null;
    if (auth) {
        try {
            token = JSON.parse(auth).token;
        } catch (e) {
            token = null;
        }
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