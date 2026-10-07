import { apiFetch } from "../../../helpers/apiHelper";
export const getUsers = () => apiFetch("/users");
export const getMe = () => apiFetch("/users/me");
export const putMe = (body) => apiFetch("/users/me", { method: "PUT", body });
export const postPhoto = (form) => apiFetch("/users/me/photo", { method: "POST", form });
export const putPassword = (body) => apiFetch("/users/me/password", { method: "PUT", body });
