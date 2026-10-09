import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUsersStore } from "./usersStore";
import { getMe, getUsers, putMe } from "../api/userApi";

vi.mock("../api/userApi", () => ({ getUsers: vi.fn(), getMe: vi.fn(), putMe: vi.fn() }));

beforeEach(() => {
  getUsers.mockReset();
  getMe.mockReset();
  putMe.mockReset();
  setActivePinia(createPinia());
});

describe("usersStore", () => {
  it("mengambil pengguna dari data.users", async () => {
    getUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    const store = useUsersStore();
    await store.fetchUsers();
    expect(store.users).toEqual([{ id: 1 }]);
  });

  it("memakai data langsung atau array kosong bila data.users tidak ada", async () => {
    const store = useUsersStore();
    getUsers.mockResolvedValueOnce({ data: [{ id: 2 }] });
    await store.fetchUsers();
    expect(store.users).toEqual([{ id: 2 }]);
    getUsers.mockResolvedValueOnce({});
    await store.fetchUsers();
    expect(store.users).toEqual([]);
  });

  it("mengambil profil dari data.user atau data", async () => {
    const store = useUsersStore();
    getMe.mockResolvedValueOnce({ data: { user: { name: "A" } } });
    await store.fetchProfile();
    expect(store.profile).toEqual({ name: "A" });
    getMe.mockResolvedValueOnce({ data: { name: "B" } });
    await store.fetchProfile();
    expect(store.profile).toEqual({ name: "B" });
  });

  it("mengubah profil lalu memuat ulang dan mengembalikan pesan", async () => {
    putMe.mockResolvedValue({ message: "Tersimpan" });
    getMe.mockResolvedValue({ data: { user: { name: "Baru" } } });
    const store = useUsersStore();
    expect(await store.changeProfile({ name: "Baru" })).toBe("Tersimpan");
    expect(putMe).toHaveBeenCalledWith({ name: "Baru" });
    expect(store.profile).toEqual({ name: "Baru" });
    expect(store.isProfileChange).toBe(false);
  });

  it("menandai perubahan selesai walau terjadi error", async () => {
    putMe.mockRejectedValue(new Error("gagal"));
    const store = useUsersStore();
    await expect(store.changeProfile({})).rejects.toThrow("gagal");
    expect(store.isProfileChange).toBe(false);
  });
});
