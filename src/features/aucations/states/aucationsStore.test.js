import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAucationsStore } from "./aucationsStore";
import { getAucations } from "../api/aucationApi";

vi.mock("../api/aucationApi", () => ({ getAucations: vi.fn() }));

beforeEach(() => {
  getAucations.mockReset();
  setActivePinia(createPinia());
});

describe("aucationsStore", () => {
  it("mengisi daftar dari data.aucations dan memakai parameter bawaan", async () => {
    getAucations.mockResolvedValue({ data: { aucations: [{ id: 1 }] } });
    const store = useAucationsStore();
    await store.fetchAucations();
    expect(getAucations).toHaveBeenCalledWith({});
    expect(store.aucations).toEqual([{ id: 1 }]);
    expect(store.isAucation).toBe(false);
  });

  it("memakai data langsung bila data.aucations tidak ada", async () => {
    getAucations.mockResolvedValue({ data: [{ id: 2 }] });
    const store = useAucationsStore();
    await store.fetchAucations({ is_me: 1 });
    expect(getAucations).toHaveBeenCalledWith({ is_me: 1 });
    expect(store.aucations).toEqual([{ id: 2 }]);
  });

  it("memakai array kosong bila data tidak ada", async () => {
    getAucations.mockResolvedValue({});
    const store = useAucationsStore();
    await store.fetchAucations();
    expect(store.aucations).toEqual([]);
  });

  it("menandai loading selesai walau terjadi error", async () => {
    getAucations.mockRejectedValue(new Error("gagal"));
    const store = useAucationsStore();
    await expect(store.fetchAucations()).rejects.toThrow("gagal");
    expect(store.isAucation).toBe(false);
  });
});
