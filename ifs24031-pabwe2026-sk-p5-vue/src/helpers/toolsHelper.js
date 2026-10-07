import Swal from "sweetalert2";
const base = {
  color: "#0f172a",
  background: "#ffffff",
  confirmButtonColor: "#4338ca",
  cancelButtonColor: "#475569",
  showClass: { popup: "", backdrop: "", icon: "" },
  hideClass: { popup: "", backdrop: "", icon: "" },
};
export const showSuccessDialog = (text) => Swal.fire({ ...base, icon: "success", title: "Berhasil", text });
export const showErrorDialog = (text) => Swal.fire({ ...base, icon: "error", title: "Gagal", text });
export const showConfirmDialog = async (text) =>
  (await Swal.fire({ ...base, icon: "warning", title: "Konfirmasi", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal" })).isConfirmed;
export const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n) || 0);
export const formatDate = (d) => (d ? new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-");