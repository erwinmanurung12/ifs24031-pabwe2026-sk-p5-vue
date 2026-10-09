import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import AuthLayout from "./AuthLayout.vue";
import { routerComponents } from "../../../test-utils";

describe("AuthLayout", () => {
  it("menampilkan logo dan konten anak", () => {
    const wrapper = mount(AuthLayout, { global: { components: routerComponents } });
    expect(wrapper.find("img").attributes("alt")).toBe("Logo Delcom");
    expect(wrapper.find("[data-testid='router-view']").exists()).toBe(true);
  });
});
