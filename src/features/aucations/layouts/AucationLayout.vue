<script setup>
import SidebarComponent from "../components/SidebarComponent.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../auth/states/authStore";
const auth = useAuthStore(), router = useRouter();
function logout() { auth.logout(); router.replace("/auth/login"); }
</script>
<template>
  <header class="flex items-center justify-between bg-white px-4 py-3 shadow">
    <p class="flex items-center gap-2 font-bold text-indigo-700"><img src="/logo.svg" alt="" width="24" height="24" />Delcom Auction</p>
    <nav aria-label="Navigasi utama" class="flex items-center gap-4 text-sm font-semibold">
      <RouterLink to="/" class="text-slate-700 underline">Lelang</RouterLink>
      <button type="button" class="rounded-lg bg-indigo-700 px-3 py-1 text-white" @click="logout">Keluar</button>
    </nav>
  </header>
  <SidebarComponent />
  <main class="mx-auto max-w-5xl p-4"><RouterView /></main>
</template>
