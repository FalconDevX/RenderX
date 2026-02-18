import axios from "axios";

export const API_URL = "http://localhost:8000";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export const registerUser = async (username: string, email: string, password: string) => {
    return api.post(`/register/`, { username, email, password });
}

export const loginUser = async (email: string, password: string) => {
    return api.post(`/login/`, { email, password });
}

export const logoutUser = async () => {
    return api.post(`/logout/`);
}

export const refreshUserToken = async () => {
    return api.post(`/refresh/`);
}