import { defineComponent, h } from "vue";

export const RouterLinkStub = defineComponent({
  name: "RouterLink",
  props: { to: { type: [String, Object], default: "" } },
  setup(props, { slots }) {
    return () => h("a", { href: String(props.to) }, slots.default ? slots.default() : []);
  },
});

export const RouterViewStub = defineComponent({
  name: "RouterView",
  setup() {
    return () => h("div", { "data-testid": "router-view" });
  },
});

export const routerComponents = { RouterLink: RouterLinkStub, RouterView: RouterViewStub };

export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
