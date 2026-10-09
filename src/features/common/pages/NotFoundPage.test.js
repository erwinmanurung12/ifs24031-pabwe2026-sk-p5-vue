import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import NotFoundPage from "./NotFoundPage.vue";
import { routerComponents } from "../../../test-utils";

describe("NotFoundPage", () => {
  it("menampilkan pesan 404 dan tautan ke beranda", () => {
    const wrapper = mount(NotFoundPage, { global: { components: routerComponents } });
    expect(wrapper.find("h1").text()).toContain("404");
    expect(wrapper.find("a").attributes("href")).toBe("/");
  });
});
