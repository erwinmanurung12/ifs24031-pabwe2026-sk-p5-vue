import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { reactive } from "vue";
import HomePage from "./HomePage.vue";
import { getAucations } from "../api/aucationApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { routerComponents } from "../../../test-utils";

const route = reactive({ query: {} });
const openModal = vi.fn();

vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => route,
}));
vi.mock("../api/aucationApi", () => ({ getAucations: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal()),
  showErrorDialog: vi.fn(),
}));
vi.mock("../modals/AddModal.vue", async () => {
  const { defineComponent, h } = await import("vue");
  return {
    default: defineComponent({
      name: "AddModal",
      emits: ["added"],
      setup(_, { expose }) {
        expose({ open: openModal });
        return () => h("div", { id: "add-modal-stub" });
      },
    }),
  };
});

const items = [
  { id: 1, title: "Jam Tangan", description: "antik", start_bid: 100000, highest_bid: 250000, closed_at: "2026-10-10T10:00:00Z" },
  { id: 2, title: "Sepeda", description: "lipat", start_bid: 500000, closed_at: "2026-10-11T10:00:00Z" },
];

const mountPage = () => mount(HomePage, { global: { components: routerComponents } });
const lastParams = () => getAucations.mock.calls.at(-1)[0];

beforeEach(() => {
  route.query = {};
  getAucations.mockReset();
  getAucations.mockResolvedValue({ data: { aucations: items } });
  showErrorDialog.mockReset();
  openModal.mockReset();
  setActivePinia(createPinia());
});

describe("HomePage", () => {
  it("menampilkan status memuat lalu daftar lelang", async () => {
    let resolve;
    getAucations.mockReturnValue(new Promise((r) => { resolve = r; }));
    const wrapper = mountPage();
    await flushPromises();
    expect(wrapper.find("[role='status']").text()).toBe("Memuat data...");
    resolve({ data: { aucations: items } });
    await flushPromises();
    expect(wrapper.find("[role='status']").exists()).toBe(false);
    const cards = wrapper.findAll("li");
    expect(cards).toHaveLength(2);
    expect(cards[0].text()).toContain("Jam Tangan");
    expect(cards[0].text()).toMatch(/250\.000/);
    expect(cards[1].text()).toMatch(/500\.000/);
    expect(lastParams()).toEqual({ is_me: "", is_closed: "" });
  });

  it("menampilkan pesan kosong bila tidak ada lelang", async () => {
    getAucations.mockResolvedValue({ data: { aucations: [] } });
    const wrapper = mountPage();
    await flushPromises();
    expect(wrapper.text()).toContain("Belum ada lelang.");
  });

  it("menyaring lelang lewat pencarian", async () => {
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("#search").setValue("sepeda");
    expect(wrapper.findAll("li")).toHaveLength(1);
    expect(wrapper.find("li").text()).toContain("Sepeda");
    await wrapper.find("#search").setValue("tidak-ada");
    expect(wrapper.text()).toContain("Belum ada lelang.");
  });

  it("memuat ulang dengan parameter sesuai tab", async () => {
    const wrapper = mountPage();
    await flushPromises();
    const click = async (label) => {
      await wrapper.findAll("button[aria-pressed]").find((b) => b.text() === label).trigger("click");
      await flushPromises();
    };
    await click("Lelang Saya");
    expect(lastParams()).toEqual({ is_me: 1, is_closed: "" });
    await click("Lelang Ditutup");
    expect(lastParams()).toEqual({ is_me: "", is_closed: 1 });
    await click("Lelang Berlangsung");
    expect(lastParams()).toEqual({ is_me: "", is_closed: 0 });
    await click("Semua Lelang");
    expect(lastParams()).toEqual({ is_me: "", is_closed: "" });
    expect(wrapper.find("button[aria-pressed='true']").text()).toBe("Semua Lelang");
  });

  it("mengikuti query me pada URL", async () => {
    route.query = { me: "1" };
    const wrapper = mountPage();
    await flushPromises();
    expect(lastParams()).toEqual({ is_me: 1, is_closed: "" });
    expect(wrapper.find("button[aria-pressed='true']").text()).toBe("Lelang Saya");
    route.query = {};
    await flushPromises();
    expect(wrapper.find("button[aria-pressed='true']").text()).toBe("Semua Lelang");
  });

  it("menampilkan dialog error saat memuat gagal", async () => {
    getAucations.mockRejectedValue(new Error("Gagal memuat"));
    mountPage();
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal memuat");
  });

  it("membuka modal tambah dan memuat ulang setelah lelang ditambahkan", async () => {
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find("button.bg-indigo-700").trigger("click");
    expect(openModal).toHaveBeenCalled();
    const before = getAucations.mock.calls.length;
    wrapper.findComponent({ name: "AddModal" }).vm.$emit("added");
    await flushPromises();
    expect(getAucations.mock.calls.length).toBe(before + 1);
  });
});
