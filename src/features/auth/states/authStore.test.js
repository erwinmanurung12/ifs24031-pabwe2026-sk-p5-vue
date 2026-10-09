import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "./authStore";
import { postLogin, postRegister } from "../api/authApi";

vi.mock("../api/authApi", () => ({ postLogin: vi.fn(), postRegister: vi.fn() }));

beforeEach(() => {
  localStorage.clear();
  postLogin.mockReset();
  postRegister.mockReset();
  setActivePinia(createPinia());
});

describe("authStore", () => {
  it("belum login bila tidak ada token", () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.isAuthLogin).toBe(false);
  });

  it("membaca token yang sudah tersimpan", () => {
    localStorage.setItem("access_token", "lama");
    expect(useAuthStore().isAuthLogin).toBe(true);
  });

  it("menyimpan token dari data.token saat login", async () => {
    postLogin.mockResolvedValue({ data: { token: "t1" } });
    const store = useAuthStore();
    await store.login({ email: "a", password: "b" });
    expect(postLogin).toHaveBeenCalledWith({ email: "a", password: "b" });
    expect(store.token).toBe("t1");
    expect(localStorage.getItem("access_token")).toBe("t1");
    expect(store.isAuthLogin).toBe(true);
  });

  it("memakai data.auth_token bila data.token tidak ada", async () => {
    postLogin.mockResolvedValue({ data: { auth_token: "t2" } });
    const store = useAuthStore();
    await store.login({});
    expect(store.token).toBe("t2");
  });

  it("mengembalikan pesan saat register", async () => {
    postRegister.mockResolvedValue({ message: "Berhasil daftar" });
    expect(await useAuthStore().register({ name: "x" })).toBe("Berhasil daftar");
  });

  it("menghapus token saat logout", () => {
    localStorage.setItem("access_token", "abc");
    const store = useAuthStore();
    store.logout();
    expect(store.token).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
