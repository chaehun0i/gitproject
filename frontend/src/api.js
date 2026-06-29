import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
});

export const loginUser = async ({ email, password, name }) => {
  const response = await api.post("/auth/login", { email, password, name });
  return response.data.user;
};

export const signupUser = async ({ email, password, name }) => {
  const response = await api.post("/auth/signup", { email, password, name });
  return response.data.user;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.projects ?? [];
};

export default api;
