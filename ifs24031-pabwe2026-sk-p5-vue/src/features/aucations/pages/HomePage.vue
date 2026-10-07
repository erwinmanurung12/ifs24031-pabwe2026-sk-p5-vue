<script setup>
import { onMounted } from "vue";
import { useAucationsStore } from "../states/aucationsStore";
import { formatRupiah, formatDate, showErrorDialog } from "../../../helpers/toolsHelper";
const store = useAucationsStore();
onMounted(() => store.fetchAucations().catch((e) => showErrorDialog(e.message)));
</script>
<template>
  <h1 class="mb-4 text-2xl font-extrabold">Daftar Lelang</h1>
  <p v-if="store.isAucation" role="status">Memuat data...</p>
  <p v-else-if="!store.aucations.length" class="text-slate-700">Belum ada lelang.</p>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="a in store.aucations" :key="a.id" class="rounded-xl bg-white p-4 shadow">
      <h2 class="font-bold">{{ a.title }}</h2>
      <p class="text-sm text-slate-700">Harga awal: {{ formatRupiah(a.start_bid) }}</p>
      <p class="text-sm text-slate-700">Ditutup: {{ formatDate(a.closed_at) }}</p>
    </li>
  </ul>
</template>
