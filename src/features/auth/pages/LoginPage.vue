<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog } from "../../../helpers/toolsHelper";
const auth = useAuthStore(), router = useRouter();
const [email, onEmail] = useInput(""), [password, onPassword] = useInput("");
async function submit() {
  try { await auth.login({ email: email.value, password: password.value }); router.replace("/"); }
  catch (e) { showErrorDialog(e.message); }
}
</script>
<template>
  <h1 class="mb-6 text-center text-2xl font-extrabold">Masuk Akun</h1>
  <form class="space-y-4" @submit.prevent="submit">
    <div><label for="login-email-input" class="mb-1 block text-sm font-semibold text-slate-700">Alamat email</label>
      <input id="login-email-input" type="email" autocomplete="email" required :value="email" @input="onEmail" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
    <div><label for="login-password-input" class="mb-1 block text-sm font-semibold text-slate-700">Kata sandi</label>
      <input id="login-password-input" type="password" autocomplete="current-password" required :value="password" @input="onPassword" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
    <button id="login-submit-button" type="submit" class="w-full rounded-lg bg-indigo-700 py-2 font-semibold text-white hover:bg-indigo-800">Masuk sekarang</button>
  </form>
  <p class="mt-4 text-center text-sm text-slate-700">Belum punya akun? <RouterLink to="/auth/register" class="font-semibold text-indigo-700 underline">Daftar baru</RouterLink></p>
</template>