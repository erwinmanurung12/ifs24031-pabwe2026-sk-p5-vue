import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UsersPage from "./UsersPage.vue";
import { getUsers } from "../api/userApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";

vi.mock("../api/userApi", () => ({ getUsers: vi.fn(), getMe: vi.fn(), putMe: vi.fn() }));
vi.mock("../../../helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));

beforeEach(() => {
  getUsers.mockReset();
  showErrorDialog.mockReset();
  setActivePinia(createPinia());
});

describe("UsersPage", () => {
  it("menampilkan daftar pengguna", async () => {
    getUsers.mockResolvedValue({
      data: { users: [{ id: 1, name: "Ani", email: "ani@mail.com" }, { id: 2, name: "Budi", email: "budi@mail.com" }] },
    });
    const wrapper = mount(UsersPage);
    await flushPromises();
    const items = wrapper.findAll("li");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toContain("Ani");
    expect(items[1].text()).toContain("budi@mail.com");
  });

  it("menampilkan dialog error saat gagal memuat", async () => {
    getUsers.mockRejectedValue(new Error("Gagal memuat"));
    const wrapper = mount(UsersPage);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal memuat");
    expect(wrapper.findAll("li")).toHaveLength(0);
  });
});
