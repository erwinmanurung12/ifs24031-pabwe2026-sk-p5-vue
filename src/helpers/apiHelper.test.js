import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper";

const respond = (body, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("access token", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe("apiFetch", () => {
  it("memakai GET tanpa opsi, tanpa header, dan tanpa body", async () => {
    const fetchMock = respond({ success: true, data: 1 });
    vi.stubGlobal("fetch", fetchMock);
    const json = await apiFetch("/x");
    expect(json).toEqual({ success: true, data: 1 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://open-api.delcom.org/api/v1/x");
    expect(init).toEqual({ method: "GET", headers: {}, body: undefined });
  });

  it("menyaring parameter kosong dan menambahkan token", async () => {
    putAccessToken("tok");
    const fetchMock = respond({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/x", { params: { a: "1", b: "", c: null, d: undefined, e: 0 } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://open-api.delcom.org/api/v1/x?a=1&e=0");
    expect(init.headers).toEqual({ Authorization: "Bearer tok" });
  });

  it("mengirim body JSON dengan Content-Type", async () => {
    const fetchMock = respond({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/x", { method: "POST", body: { a: 1 } });
    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("mengirim form apa adanya", async () => {
    const fetchMock = respond({ success: true });
    vi.stubGlobal("fetch", fetchMock);
    const form = new FormData();
    await apiFetch("/x", { method: "POST", form });
    expect(fetchMock.mock.calls[0][1].body).toBe(form);
  });

  it("melempar pesan dari server saat respons tidak ok", async () => {
    vi.stubGlobal("fetch", respond({ message: "Gagal dari server" }, false));
    await expect(apiFetch("/x")).rejects.toThrow("Gagal dari server");
  });

  it("melempar error saat success bernilai false", async () => {
    vi.stubGlobal("fetch", respond({ success: false, message: "Ditolak" }));
    await expect(apiFetch("/x")).rejects.toThrow("Ditolak");
  });

  it("memakai pesan bawaan saat body bukan JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: () => Promise.reject(new Error("bad")) }),
    );
    await expect(apiFetch("/x")).rejects.toThrow("Terjadi kesalahan");
  });

  it("mengembalikan objek kosong saat body bukan JSON tetapi respons ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.reject(new Error("bad")) }),
    );
    expect(await apiFetch("/x")).toEqual({});
  });
});
