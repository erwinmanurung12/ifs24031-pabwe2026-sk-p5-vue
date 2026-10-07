import { defineStore } from "pinia";
import { ref } from "vue";
import { getAucations } from "../api/aucationApi";
export const useAucationsStore = defineStore("aucations", () => {
  const aucations = ref([]), isAucation = ref(false);
  async function fetchAucations(params = {}) {
    isAucation.value = true;
    try { const r = await getAucations(params); aucations.value = r.data?.aucations ?? r.data ?? []; }
    finally { isAucation.value = false; }
  }
  return { aucations, isAucation, fetchAucations };
});
