import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import AddModal from "./AddModal.vue";
import { postAucation } from "../api/aucationApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/aucationApi", () => ({ postAucation: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

beforeEach(() => {
  postAucation.mockReset();
  showErrorDialog.mockReset();
  showSuccessDialog.mockReset();
  vi.spyOn(HTMLDialogElement.prototype, "showModal");
  vi.spyOn(HTMLDialogElement.prototype, "close");
});

async function fillForm(wrapper) {
  await wrapper.find("#a-title").setValue("Jam tangan");
  await wrapper.find("#a-desc").setValue("Jam antik");
  await wrapper.find("#a-bid").setValue("150000");
  await wrapper.find("#a-closed").setValue("2026-10-10T10:00");
}

describe("AddModal", () => {
  it("membuka dialog lewat fungsi open", () => {
    const wrapper = mount(AddModal);
    wrapper.vm.open();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(wrapper.find("dialog").attributes("open")).toBeDefined();
  });

  it("menutup dialog saat tombol Batal ditekan", async () => {
    const wrapper = mount(AddModal);
    wrapper.vm.open();
    await wrapper.find("button[type='button']").trigger("click");
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(wrapper.find("dialog").attributes("open")).toBeUndefined();
  });

  it("menyimpan lelang, menutup dialog, dan mengirim event added", async () => {
    postAucation.mockResolvedValue({ message: "Lelang dibuat" });
    const wrapper = mount(AddModal);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(postAucation).toHaveBeenCalledWith({
      title: "Jam tangan",
      description: "Jam antik",
      start_bid: 150000,
      closed_at: new Date("2026-10-10T10:00").toISOString(),
    });
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(showSuccessDialog).toHaveBeenCalledWith("Lelang dibuat");
    expect(wrapper.emitted("added")).toHaveLength(1);
  });

  it("menampilkan dialog error saat penyimpanan gagal", async () => {
    postAucation.mockRejectedValue(new Error("Gagal simpan"));
    const wrapper = mount(AddModal);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal simpan");
    expect(wrapper.emitted("added")).toBeUndefined();
  });
});
