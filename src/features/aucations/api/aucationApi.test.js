import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./aucationApi";
import { apiFetch } from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

beforeEach(() => apiFetch.mockReset());

describe("aucationApi", () => {
  it("memanggil endpoint yang benar", () => {
    const form = new FormData();
    api.getAucations({ a: 1 });
    api.getAucation(3);
    api.postAucation({ t: 1 });
    api.putAucation(3, { t: 2 });
    api.postCover(3, form);
    api.deleteAucation(3);
    api.postBid(3, { bid: 5 });
    api.deleteBid(3);
    api.deleteAllAucations();
    expect(apiFetch.mock.calls).toEqual([
      ["/aucations", { params: { a: 1 } }],
      ["/aucations/3"],
      ["/aucations", { method: "POST", body: { t: 1 } }],
      ["/aucations/3", { method: "PUT", body: { t: 2 } }],
      ["/aucations/3/cover", { method: "POST", form }],
      ["/aucations/3", { method: "DELETE" }],
      ["/aucations/3/bids", { method: "POST", body: { bid: 5 } }],
      ["/aucations/3/bids", { method: "DELETE" }],
      ["/aucations", { method: "DELETE" }],
    ]);
  });
});
