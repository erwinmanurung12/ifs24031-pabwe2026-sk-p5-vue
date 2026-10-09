import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ProfilePage from "./ProfilePage.vue";
import { useUsersStore } from "../states/usersStore";
import { getMe, putMe } from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/userApi", () => ({ getUsers: vi.fn(), getMe: vi.fn(), putMe: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

beforeEach(() => {
  getMe.mockReset();
  putMe.mockReset();
  showErrorDialog.mockReset();
  showSuccessDialog.mockReset();
  setActivePinia(createPinia());
});

describe("ProfilePage", () => {
  it("menampilkan email dan mengisi nama dari profil", async () => {
    getMe.mockResolvedValue({ data: { user: { name: "Ani", email: "ani@mail.com" } } });
    const wrapper = mount(ProfilePage);
    expect(wrapper.find("form").exists()).toBe(false);
    await flushPromises();
    expect(wrapper.text()).toContain("ani@mail.com");
    expect(wrapper.find("#name").element.value).toBe("Ani");
  });

  it("tidak mengubah nama saat profil dikosongkan", async () => {
    getMe.mockResolvedValue({ data: { user: { name: "Ani", email: "ani@mail.com" } } });
    const wrapper = mount(ProfilePage);
    await flushPromises();
    useUsersStore().profile = null;
    await flushPromises();
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("menyimpan perubahan nama dan menampilkan pesan sukses", async () => {
    getMe.mockResolvedValue({ data: { user: { name: "Ani", email: "ani@mail.com" } } });
    putMe.mockResolvedValue({ message: "Profil diperbarui" });
    const wrapper = mount(ProfilePage);
    await flushPromises();
    await wrapper.find("#name").setValue("Ani Baru");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(putMe).toHaveBeenCalledWith({ name: "Ani Baru" });
    expect(showSuccessDialog).toHaveBeenCalledWith("Profil diperbarui");
  });

  it("menampilkan dialog error saat menyimpan gagal", async () => {
    getMe.mockResolvedValue({ data: { user: { name: "Ani", email: "ani@mail.com" } } });
    putMe.mockRejectedValue(new Error("Gagal simpan"));
    const wrapper = mount(ProfilePage);
    await flushPromises();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal simpan");
  });

  it("menampilkan dialog error saat memuat profil gagal", async () => {
    getMe.mockRejectedValue(new Error("Gagal muat"));
    mount(ProfilePage);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal muat");
  });
});
