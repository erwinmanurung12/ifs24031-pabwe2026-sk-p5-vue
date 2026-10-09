import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DetailPage from "./DetailPage.vue";
import { deleteAucation, getAucation, postBid } from "../api/aucationApi";
import {
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import { routerComponents } from "../../../test-utils";

const replace = vi.fn();
vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => ({ params: { aucationId: "7" } }),
  useRouter: () => ({ replace }),
}));
vi.mock("../api/aucationApi", () => ({
  getAucation: vi.fn(),
  postBid: vi.fn(),
  deleteAucation: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

const detail = {
  id: 7,
  title: "Jam Tangan",
  description: "Jam antik",
  start_bid: 100000,
  closed_at: "2026-10-10T10:00:00Z",
  bids: [{ id: 1, bid: 150000, user: { name: "Ani" } }, { id: 2, bid: 200000 }],
};

const mountPage = () => mount(DetailPage, { global: { components: routerComponents } });

beforeEach(() => {
  [replace, getAucation, postBid, deleteAucation, showConfirmDialog, showErrorDialog, showSuccessDialog].forEach((m) => m.mockReset());
  getAucation.mockResolvedValue({ data: { aucation: detail } });
});

describe("DetailPage", () => {
  it("menampilkan status memuat lalu rincian lelang beserta penawaran", async () => {
    let resolve;
    getAucation.mockReturnValue(new Promise((r) => { resolve = r; }));
    const wrapper = mountPage();
    expect(wrapper.find("[role='status']").text()).toBe("Memuat data...");
    resolve({ data: { aucation: detail } });
    await flushPromises();
    expect(getAucation).toHaveBeenCalledWith("7");
    expect(wrapper.find("h1").text()).toBe("Jam Tangan");
    const bids = wrapper.findAll("li");
    expect(bids).toHaveLength(2);
    expect(bids[0].text()).toContain("Ani");
    expect(bids[1].text()).toContain("Peserta");
  });

  it("memakai data langsung dan menampilkan pesan bila belum ada penawaran", async () => {
    getAucation.mockResolvedValue({ data: { ...detail, bids: undefined } });
    const wrapper = mountPage();
    await flushPromises();
    expect(wrapper.find("h1").text()).toBe("Jam Tangan");
    expect(wrapper.text()).toContain("Belum ada penawaran.");
  });

  it("menampilkan pesan error dari server saat gagal memuat", async () => {
    getAucation.mockRejectedValue(new Error("Tidak ditemukan"));
    const wrapper = mountPage();
    await flushPromises();
    expect(wrapper.find("h1").text()).toBe("Lelang tidak ditemukan");
    expect(wrapper.find("[role='alert']").text()).toBe("Tidak ditemukan");
  });

  it("menampilkan pesan bawaan bila data kosong tanpa error", async () => {
    getAucation.mockResolvedValue({});
    const wrapper = mountPage();
    await flushPromises();
    expect(wrapper.find("[role='alert']").text()).toBe("Data lelang tidak tersedia");
  });

  it("mengajukan tawaran lalu memuat ulang data", async () => {
    postBid.mockResolvedValue({ message: "Tawaran diterima" });
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("#bid").setValue("300000");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(postBid).toHaveBeenCalledWith("7", { bid: 300000 });
    expect(showSuccessDialog).toHaveBeenCalledWith("Tawaran diterima");
    expect(getAucation).toHaveBeenCalledTimes(2);
    expect(wrapper.find("#bid").element.value).toBe("");
  });

  it("menampilkan dialog error saat tawaran gagal", async () => {
    postBid.mockRejectedValue(new Error("Tawaran terlalu rendah"));
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Tawaran terlalu rendah");
  });

  it("tidak menghapus bila konfirmasi dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("button.bg-red-700").trigger("click");
    await flushPromises();
    expect(deleteAucation).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("menghapus lelang lalu kembali ke beranda", async () => {
    showConfirmDialog.mockResolvedValue(true);
    deleteAucation.mockResolvedValue({});
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("button.bg-red-700").trigger("click");
    await flushPromises();
    expect(deleteAucation).toHaveBeenCalledWith("7");
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("menampilkan dialog error saat penghapusan gagal", async () => {
    showConfirmDialog.mockResolvedValue(true);
    deleteAucation.mockRejectedValue(new Error("Gagal hapus"));
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("button.bg-red-700").trigger("click");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal hapus");
    expect(replace).not.toHaveBeenCalled();
  });
});
