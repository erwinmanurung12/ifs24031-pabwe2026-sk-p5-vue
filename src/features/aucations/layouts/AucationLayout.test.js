import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import AucationLayout from "./AucationLayout.vue";
import { useAuthStore } from "../../auth/states/authStore";
import { routerComponents } from "../../../test-utils";

const replace = vi.fn();
vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRouter: () => ({ replace }),
}));

beforeEach(() => {
  replace.mockReset();
  localStorage.setItem("access_token", "tok");
  setActivePinia(createPinia());
});

describe("AucationLayout", () => {
  it("menampilkan header, sidebar, dan konten", () => {
    const wrapper = mount(AucationLayout, { global: { components: routerComponents } });
    expect(wrapper.text()).toContain("Delcom Auction");
    expect(wrapper.find("nav[aria-label='Menu lelang']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='router-view']").exists()).toBe(true);
  });

  it("keluar dari akun lalu pindah ke halaman login", async () => {
    const wrapper = mount(AucationLayout, { global: { components: routerComponents } });
    const auth = useAuthStore();
    expect(auth.isAuthLogin).toBe(true);
    await wrapper.find("button").trigger("click");
    expect(auth.isAuthLogin).toBe(false);
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(replace).toHaveBeenCalledWith("/auth/login");
  });
});
