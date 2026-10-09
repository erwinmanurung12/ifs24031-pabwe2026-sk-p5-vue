import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SidebarComponent from "./SidebarComponent.vue";
import { routerComponents } from "../../../test-utils";

describe("SidebarComponent", () => {
  it("menampilkan empat tautan menu", () => {
    const wrapper = mount(SidebarComponent, { global: { components: routerComponents } });
    const links = wrapper.findAll("a");
    expect(links.map((l) => l.text())).toEqual([
      "Dashboard Lelang",
      "Lelang Saya",
      "Daftar Pengguna",
      "Profil Saya",
    ]);
    expect(links.map((l) => l.attributes("href"))).toEqual(["/", "/?me=1", "/users", "/profile"]);
  });
});
