import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("memakai string kosong sebagai nilai awal bawaan", () => {
    const [value] = useInput();
    expect(value.value).toBe("");
  });

  it("memakai nilai awal dan memperbarui nilai dari event", () => {
    const [value, onChange] = useInput("awal");
    expect(value.value).toBe("awal");
    onChange({ target: { value: "baru" } });
    expect(value.value).toBe("baru");
  });
});
