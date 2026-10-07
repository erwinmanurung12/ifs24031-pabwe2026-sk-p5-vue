<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAucation, postBid, deleteAucation } from "../api/aucationApi";
import { formatRupiah, formatDate, showErrorDialog, showSuccessDialog, showConfirmDialog } from "../../../helpers/toolsHelper";
import { useInput } from "../../../hooks/useInput";
const route = useRoute(), router = useRouter();
const aucation = ref(null), isLoading = ref(true);
const [bid, onBid] = useInput("");
async function load() {
  isLoading.value = true;
  try { const r = await getAucation(route.params.aucationId); aucation.value = r.data?.aucation ?? r.data; }
  catch (e) { showErrorDialog(e.message); }
  finally { isLoading.value = false; }
}
async function submitBid() {
  try { const r = await postBid(route.params.aucationId, { bid: Number(bid.value) }); await showSuccessDialog(r.message); bid.value = ""; await load(); }
  catch (e) { showErrorDialog(e.message); }
}
async function remove() {
  if (!(await showConfirmDialog("Hapus lelang ini?"))) return;
  try { await deleteAucation(route.params.aucationId); router.replace("/"); } catch (e) { showErrorDialog(e.message); }
}
onMounted(load);
</script>
<template>
  <RouterLink to="/" class="text-sm font-semibold text-indigo-700 underline">&larr; Kembali ke daftar</RouterLink>
  <p v-if="isLoading" role="status" class="mt-4">Memuat data...</p>
  <article v-else-if="aucation" class="mt-4 rounded-xl bg-white p-6 shadow">
    <h1 class="text-2xl font-extrabold">{{ aucation.title }}</h1>
    <p class="mt-2 whitespace-pre-line text-slate-700">{{ aucation.description }}</p>
    <p class="mt-2 text-sm text-slate-700">Harga awal: {{ formatRupiah(aucation.start_bid) }}</p>
    <p class="text-sm text-slate-700">Ditutup: {{ formatDate(aucation.closed_at) }}</p>
    <h2 class="mt-6 font-bold">Riwayat penawaran</h2>
    <ul class="mt-2 space-y-1 text-sm text-slate-700">
      <li v-for="b in aucation.bids || []" :key="b.id">{{ b.user?.name || "Peserta" }}: {{ formatRupiah(b.bid) }}</li>
      <li v-if="!(aucation.bids || []).length">Belum ada penawaran.</li>
    </ul>
    <form class="mt-4 flex items-end gap-2" @submit.prevent="submitBid">
      <div class="flex-1"><label for="bid" class="mb-1 block text-sm font-semibold text-slate-700">Nominal penawaran (Rp)</label>
        <input id="bid" type="number" min="1" required :value="bid" @input="onBid" class="w-full rounded-lg border border-slate-400 px-3 py-2" /></div>
      <button type="submit" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white">Ajukan tawaran</button>
    </form>
    <button type="button" class="mt-4 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white" @click="remove">Hapus lelang</button>
  </article>
</template>
