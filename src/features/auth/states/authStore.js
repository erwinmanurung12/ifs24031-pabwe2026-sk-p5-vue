import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { postLogin, postRegister } from "../api/authApi";
import { getAccessToken, putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
export const useAuthStore = defineStore("auth", () => {
  const token = ref(getAccessToken());
  const isAuthLogin = computed(() => !!token.value);
  async function login(payload) {
    const r = await postLogin(payload);
    const t = r.data?.token ?? r.data?.auth_token;
    putAccessToken(t); token.value = t;
  }
  async function register(payload) { return (await postRegister(payload)).message; }
  function logout() { removeAccessToken(); token.value = null; }
  return { token, isAuthLogin, login, register, logout };
});
