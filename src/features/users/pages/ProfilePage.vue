<script setup>
import { onMounted, watch } from "vue";
import { useUsersStore } from "../states/usersStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
const store = useUsersStore();
const [name, onName] = useInput("");
watch(() => store.profile, (p) => { if (p) name.value = p.name; });
onMounted(() => store.fetchProfile().catch((e) => showErrorDialog(e.message)));
async function submit() {
  try { showSuccessDialog(await store.changeProfile({ name: name.value })); } catch (e) { showErrorDialog(e.message); }
}
</script>
<template>
  <h1 class="mb-4 text-2xl font-extrabold">Profil Saya</h1>
  <section v-if="store.profile" class="max-w-md rounded-xl bg-white p-6 shadow">
    <p class="text-sm text-slate-700">Email: {{ store.profile.email }}</p>
    <form class="mt-4 space-y-3" @submit.prevent="submit">
      <div><label for="name" class="mb-1 block text-sm font-semibold text-slate-700">Nama lengkap</label>
        <input id="name" required :value="name" @input="onName" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
      <button type="submit" :disabled="store.isProfileChange" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white">Simpan</button>
    </form>
  </section>
</template>
