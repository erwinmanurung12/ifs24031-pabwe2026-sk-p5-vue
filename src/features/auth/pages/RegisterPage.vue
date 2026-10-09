<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
const auth = useAuthStore(), router = useRouter();
const [name, onName] = useInput(""), [email, onEmail] = useInput(""), [password, onPassword] = useInput("");
async function submit() {
  try {
    const msg = await auth.register({ name: name.value, email: email.value, password: password.value });
    await showSuccessDialog(msg); router.replace("/auth/login");
  } catch (e) { showErrorDialog(e.message); }
}
</script>
<template>
  <h1 class="mb-6 text-center text-2xl font-extrabold">Daftar Akun</h1>
  <form class="space-y-4" @submit.prevent="submit">
    <div><label for="name" class="mb-1 block text-sm font-semibold text-slate-700">Nama lengkap</label>
      <input id="name" autocomplete="name" required :value="name" @input="onName" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
    <div><label for="email" class="mb-1 block text-sm font-semibold text-slate-700">Alamat email</label>
      <input id="email" type="email" autocomplete="email" required :value="email" @input="onEmail" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
    <div><label for="password" class="mb-1 block text-sm font-semibold text-slate-700">Kata sandi</label>
      <input id="password" type="password" autocomplete="new-password" minlength="6" required :value="password" @input="onPassword" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
    <button type="submit" class="w-full rounded-lg bg-indigo-700 py-2 font-semibold text-white hover:bg-indigo-800">Daftar sekarang</button>
  </form>
  <p class="mt-4 text-center text-sm text-slate-700">Sudah punya akun? <RouterLink to="/auth/login" class="font-semibold text-indigo-700 underline">Masuk</RouterLink></p>
</template>
