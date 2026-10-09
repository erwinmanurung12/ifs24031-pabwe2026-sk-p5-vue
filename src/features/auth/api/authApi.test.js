import { beforeEach, describe, expect, it, vi } from "vitest";
import { postLogin, postRegister } from "./authApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

beforeEach(() => apiFetch.mockReset());

describe("authApi", () => {
  it("memanggil endpoint login dan register", () => {
    postLogin({ email: "a" });
    postRegister({ name: "b" });
    expect(apiFetch.mock.calls).toEqual([
      ["/auth/login", { method: "POST", body: { email: "a" } }],
      ["/auth/register", { method: "POST", body: { name: "b" } }],
    ]);
  });
});
