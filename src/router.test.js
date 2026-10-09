import { beforeEach, describe, expect, it, vi } from "vitest";
import router from "./router";
import { getAccessToken } from "./helpers/apiHelper";

vi.mock("./helpers/apiHelper", () => ({ getAccessToken: vi.fn() }));

beforeEach(async () => {
  getAccessToken.mockReturnValue(null);
  await router.replace("/auth/login");
});

describe("router", () => {
  it("mengarahkan tamu ke halaman login saat membuka halaman terproteksi", async () => {
    await router.push("/users");
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("mengizinkan tamu membuka halaman register", async () => {
    await router.push("/auth/register");
    expect(router.currentRoute.value.path).toBe("/auth/register");
  });

  it("mengizinkan tamu membuka halaman yang tidak dikenal", async () => {
    await router.push("/tidak-ada");
    expect(router.currentRoute.value.path).toBe("/tidak-ada");
    expect(router.currentRoute.value.matched).toHaveLength(1);
  });

  it("mengarahkan pengguna yang sudah login dari halaman auth ke beranda", async () => {
    await router.replace("/auth/register");
    getAccessToken.mockReturnValue("tok");
    await router.push("/auth/login");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("memuat semua halaman terproteksi untuk pengguna yang sudah login", async () => {
    getAccessToken.mockReturnValue("tok");
    for (const path of ["/", "/users", "/profile", "/aucations/9"]) {
      await router.push(path);
      expect(router.currentRoute.value.path).toBe(path);
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0);
    }
    expect(router.currentRoute.value.params.aucationId).toBe("9");
  });

  it("memuat halaman 404 untuk pengguna yang sudah login", async () => {
    getAccessToken.mockReturnValue("tok");
    await router.push("/halaman/tidak/ada");
    expect(router.currentRoute.value.path).toBe("/halaman/tidak/ada");
  });
});
