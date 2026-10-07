<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { showErrorDialog } from "../../../helpers/toolsHelper";
const store = useUsersStore();
onMounted(() => store.fetchUsers().catch((e) => showErrorDialog(e.message)));
</script>
<template>
  <h1 class="mb-4 text-2xl font-extrabold">Daftar Pengguna</h1>
  <ul class="grid gap-3 sm:grid-cols-2">
    <li v-for="u in store.users" :key="u.id" class="rounded-xl bg-white p-4 shadow">
      <p class="font-bold">{{ u.name }}</p><p class="text-sm text-slate-700">{{ u.email }}</p>
    </li>
  </ul>
</template>
