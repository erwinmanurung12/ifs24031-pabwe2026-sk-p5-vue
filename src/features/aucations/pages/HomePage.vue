<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAucationsStore } from "../states/aucationsStore";
import AddModal from "../modals/AddModal.vue";
import { formatRupiah, formatDate, showErrorDialog } from "../../../helpers/toolsHelper";
const store = useAucationsStore(), route = useRoute();
const tab = ref("all"), q = ref(""), modal = ref(null);
const tabs = [["all", "Semua Lelang"], ["me", "Lelang Saya"], ["open", "Lelang Berlangsung"], ["closed", "Lelang Ditutup"]];
const load = () => store.fetchAucations({ is_me: tab.value === "me" ? 1 : "", is_closed: tab.value === "closed" ? 1 : tab.value === "open" ? 0 : "" }).catch((e) => showErrorDialog(e.message));
const shown = computed(() => store.aucations.filter((a) => `${a.title} ${a.description}`.toLowerCase().includes(q.value.toLowerCase())));
watch(() => route.query.me, (m) => { tab.value = m ? "me" : "all"; }, { immediate: true });
watch(tab, load);
onMounted(load);
</script>
<template>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
    <h1 class="text-2xl font-extrabold">Daftar Lelang</h1>
    <button type="button" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white" @click="modal.open()">Tambah lelang</button>
  </div>
  <div role="group" aria-label="Filter lelang" class="mb-3 flex flex-wrap gap-2">
    <button v-for="[k, t] in tabs" :key="k" type="button" :aria-pressed="tab === k" @click="tab = k"
      :class="tab === k ? 'bg-indigo-700 text-white' : 'bg-white text-slate-900'" class="rounded-lg px-3 py-1 text-sm font-semibold shadow">{{ t }}</button>
  </div>
  <label for="search" class="mb-1 block text-sm font-semibold text-slate-700">Cari judul atau deskripsi</label>
  <input id="search" v-model="q" class="mb-4 w-full rounded-lg border border-slate-400 px-3 py-2" />
  <p v-if="store.isAucation" role="status">Memuat data...</p>
  <p v-else-if="!shown.length" class="text-slate-700">Belum ada lelang.</p>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="a in shown" :key="a.id" class="rounded-xl bg-white p-4 shadow">
      <h2 class="font-bold"><RouterLink :to="`/aucations/${a.id}`" class="text-indigo-700 underline">{{ a.title }}</RouterLink></h2>
      <p class="text-sm text-slate-700">Harga awal: {{ formatRupiah(a.start_bid) }}</p>
      <p class="text-sm text-slate-700">Tawaran tertinggi: {{ formatRupiah(a.highest_bid ?? a.start_bid) }}</p>
      <p class="text-sm text-slate-700">Ditutup: {{ formatDate(a.closed_at) }}</p>
    </li>
  </ul>
  <AddModal ref="modal" @added="load" />
</template>
