import { defineStore } from "pinia";
import { ref } from "vue";
import { getUsers, getMe, putMe } from "../api/userApi";
export const useUsersStore = defineStore("users", () => {
  const users = ref([]), user = ref(null), profile = ref(null), isProfileChange = ref(false);
  async function fetchUsers() { const r = await getUsers(); users.value = r.data?.users ?? r.data ?? []; }
  async function fetchProfile() { const r = await getMe(); profile.value = r.data?.user ?? r.data; }
  async function changeProfile(body) {
    isProfileChange.value = true;
    try { const r = await putMe(body); await fetchProfile(); return r.message; } finally { isProfileChange.value = false; }
  }
  return { users, user, profile, isProfileChange, fetchUsers, fetchProfile, changeProfile };
});
