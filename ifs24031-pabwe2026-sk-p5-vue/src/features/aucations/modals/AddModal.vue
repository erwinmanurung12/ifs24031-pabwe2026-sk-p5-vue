<script setup>
import { ref } from "vue";
import { postAucation } from "../api/aucationApi";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
const emit = defineEmits(["added"]);
const dlg = ref(null);
const [title, onTitle] = useInput(""), [description, onDesc] = useInput(""), [startBid, onBid] = useInput(""), [closedAt, onClosed] = useInput("");
const open = () => dlg.value.showModal();
defineExpose({ open });
async function submit() {
  try {
    const r = await postAucation({ title: title.value, description: description.value, start_bid: Number(startBid.value), closed_at: new Date(closedAt.value).toISOString() });
    dlg.value.close(); await showSuccessDialog(r.message); emit("added");
  } catch (e) { showErrorDialog(e.message); }
}
const IN = "w-full rounded-lg border border-slate-400 px-3 py-2", LB = "mb-1 block text-sm font-semibold text-slate-700";
</script>
<template>
  <dialog ref="dlg" aria-labelledby="add-title" class="m-auto w-full max-w-md rounded-2xl p-6 backdrop:bg-black/50">
    <h2 id="add-title" class="mb-4 text-xl font-extrabold">Tambah Lelang</h2>
    <form class="space-y-3" @submit.prevent="submit">
      <div><label for="a-title" :class="LB">Judul</label><input id="a-title" required :value="title" @input="onTitle" :class="IN" /></div>
      <div><label for="a-desc" :class="LB">Deskripsi</label><textarea id="a-desc" required rows="3" :value="description" @input="onDesc" :class="IN"></textarea></div>
      <div><label for="a-bid" :class="LB">Harga awal (Rp)</label><input id="a-bid" type="number" min="1" required :value="startBid" @input="onBid" :class="IN" /></div>
      <div><label for="a-closed" :class="LB">Batas penutupan</label><input id="a-closed" type="datetime-local" required :value="closedAt" @input="onClosed" :class="IN" /></div>
      <div class="flex justify-end gap-2">
        <button type="button" class="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-900" @click="dlg.close()">Batal</button>
        <button type="submit" class="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white">Simpan</button>
      </div>
    </form>
  </dialog>
</template>
