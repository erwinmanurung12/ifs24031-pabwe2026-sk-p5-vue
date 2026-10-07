import Swal from "sweetalert2";
export const showSuccessDialog = (text) => Swal.fire({ icon: "success", title: "Berhasil", text });
export const showErrorDialog = (text) => Swal.fire({ icon: "error", title: "Gagal", text });
export const showConfirmDialog = async (text) =>
  (await Swal.fire({ icon: "warning", title: "Konfirmasi", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal" })).isConfirmed;
export const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n) || 0);
export const formatDate = (d) => (d ? new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-");
