import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMe, getUsers, postPhoto, putMe, putPassword } from "./userApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

beforeEach(() => apiFetch.mockReset());

describe("userApi", () => {
  it("memanggil endpoint pengguna", () => {
    const form = new FormData();
    getUsers();
    getMe();
    putMe({ name: "a" });
    postPhoto(form);
    putPassword({ p: 1 });
    expect(apiFetch.mock.calls).toEqual([
      ["/users"],
      ["/users/me"],
      ["/users/me", { method: "PUT", body: { name: "a" } }],
      ["/users/me/photo", { method: "POST", form }],
      ["/users/me/password", { method: "PUT", body: { p: 1 } }],
    ]);
  });
});
