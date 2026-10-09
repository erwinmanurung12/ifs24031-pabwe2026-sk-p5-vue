import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import LoginPage from "./LoginPage.vue";
import { postLogin } from "../api/authApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { routerComponents } from "../../../test-utils";

const replace = vi.fn();
vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useRouter: () => ({ replace }),
}));
vi.mock("../api/authApi", () => ({ postLogin: vi.fn(), postRegister: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

const mountPage = () => mount(LoginPage, { global: { components: routerComponents } });

beforeEach(() => {
  localStorage.clear();
  replace.mockReset();
  postLogin.mockReset();
  showErrorDialog.mockReset();
  setActivePinia(createPinia());
});

describe("LoginPage", () => {
  it("menampilkan form dan tautan daftar", () => {
    const wrapper = mountPage();
    expect(wrapper.find("h1").text()).toBe("Masuk Akun");
    expect(wrapper.find("a").attributes("href")).toBe("/auth/register");
  });

  it("login berhasil lalu pindah ke beranda", async () => {
    postLogin.mockResolvedValue({ data: { token: "t" } });
    const wrapper = mountPage();
    await wrapper.find("#login-email-input").setValue("a@b.com");
    await wrapper.find("#login-password-input").setValue("rahasia");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(postLogin).toHaveBeenCalledWith({ email: "a@b.com", password: "rahasia" });
    expect(replace).toHaveBeenCalledWith("/");
    expect(showErrorDialog).not.toHaveBeenCalled();
  });

  it("menampilkan dialog error saat login gagal", async () => {
    postLogin.mockRejectedValue(new Error("Email salah"));
    const wrapper = mountPage();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Email salah");
    expect(replace).not.toHaveBeenCalled();
  });
});
