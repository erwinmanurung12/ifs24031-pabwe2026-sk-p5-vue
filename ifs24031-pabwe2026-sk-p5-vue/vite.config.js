import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

function inlineCss() {
  return {
    name: "inline-entry-css",
    enforce: "post",
    apply: "build",
    generateBundle(_, bundle) {
      const html = bundle["index.html"];
      if (!html) return;
      let source = String(html.source);
      for (const [name, asset] of Object.entries(bundle)) {
        if (asset.type !== "asset" || !name.endsWith(".css")) continue;
        const re = new RegExp(`<link[^>]*href="[^"]*${name}"[^>]*>`);
        if (!re.test(source)) continue;
        source = source.replace(re, () => `<style>${asset.source}</style>`);
        delete bundle[name];
      }
      html.source = source;
    },
  };
}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT) || 3000;
  return {
    plugins: [vue(), tailwindcss(), inlineCss()],
    server: { port }, preview: { port },
    define: { DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1") },
    test: { globals: true, environment: "jsdom", setupFiles: "./src/setupTests.js",
      coverage: { provider: "v8", reporter: ["text","html","lcov"], include: ["src/**/*.{js,vue}"],
        exclude: ["src/main.js","src/setupTests.js","src/test-utils.js","**/*.test.{js,jsx}"],
        thresholds: { lines:100, functions:100, branches:100, statements:100 } } },
  };
});