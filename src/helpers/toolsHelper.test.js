import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import {
  formatDate,
  formatRupiah,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

beforeEach(() => Swal.fire.mockReset());

describe("dialog", () => {
  it("menampilkan dialog sukses", async () => {
    Swal.fire.mockResolvedValue({});
    await showSuccessDialog("ok");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success", title: "Berhasil", text: "ok" }),
    );
  });

  it("menampilkan dialog error", async () => {
    Swal.fire.mockResolvedValue({});
    await showErrorDialog("gagal");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "error", title: "Gagal", text: "gagal" }),
    );
  });

  it("mengembalikan true saat dikonfirmasi", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    expect(await showConfirmDialog("yakin?")).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "warning", showCancelButton: true }),
    );
  });

  it("mengembalikan false saat dibatalkan", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?")).toBe(false);
  });
});

describe("format", () => {
  it("memformat rupiah dan menganggap nilai tidak valid sebagai 0", () => {
    expect(formatRupiah(1500)).toMatch(/1\.500/);
    expect(formatRupiah("abc")).toMatch(/0/);
  });

  it("memformat tanggal atau tanda strip bila kosong", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("2026-10-10T10:00:00Z")).not.toBe("-");
  });
});
