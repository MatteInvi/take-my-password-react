import api from "./client";

export const login = async (username, password) => {
    const response = await api.post("api/auth/login", {username, password});
    const token = response.data.token;

    localStorage.setItem("token", token);

    return token;
};