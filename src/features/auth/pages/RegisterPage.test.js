import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import RegisterPage from "./RegisterPage.vue";
import { postRegister } from "../api/authApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { routerComponents } from "../../../test-utils";

const replace = vi.fn();
vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRouter: () => ({ replace }),
}));
vi.mock("../api/authApi", () => ({ postLogin: vi.fn(), postRegister: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

const mountPage = () => mount(RegisterPage, { global: { components: routerComponents } });

beforeEach(() => {
  replace.mockReset();
  postRegister.mockReset();
  showErrorDialog.mockReset();
  showSuccessDialog.mockReset();
  setActivePinia(createPinia());
});

describe("RegisterPage", () => {
  it("menampilkan form dan tautan masuk", () => {
    const wrapper = mountPage();
    expect(wrapper.find("h1").text()).toBe("Daftar Akun");
    expect(wrapper.find("a").attributes("href")).toBe("/auth/login");
  });

  it("daftar berhasil lalu pindah ke halaman login", async () => {
    postRegister.mockResolvedValue({ message: "Akun dibuat" });
    const wrapper = mountPage();
    await wrapper.find("#name").setValue("Budi");
    await wrapper.find("#email").setValue("budi@mail.com");
    await wrapper.find("#password").setValue("rahasia");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(postRegister).toHaveBeenCalledWith({
      name: "Budi",
      email: "budi@mail.com",
      password: "rahasia",
    });
    expect(showSuccessDialog).toHaveBeenCalledWith("Akun dibuat");
    expect(replace).toHaveBeenCalledWith("/auth/login");
  });

  it("menampilkan dialog error saat daftar gagal", async () => {
    postRegister.mockRejectedValue(new Error("Email dipakai"));
    const wrapper = mountPage();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai");
    expect(replace).not.toHaveBeenCalled();
  });
});
