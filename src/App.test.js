import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";
import { routerComponents } from "./test-utils";

describe("App", () => {
  it("merender RouterView", () => {
    const wrapper = mount(App, { global: { components: routerComponents } });
    expect(wrapper.find("[data-testid='router-view']").exists()).toBe(true);
  });
});
