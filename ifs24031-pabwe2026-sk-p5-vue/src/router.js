import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from "./helpers/apiHelper";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import AucationLayout from "./features/aucations/layouts/AucationLayout.vue";
const routes = [
  { path: "/auth", component: AuthLayout, children: [
    { path: "login", component: () => import("./features/auth/pages/LoginPage.vue") },
    { path: "register", component: () => import("./features/auth/pages/RegisterPage.vue") } ] },
  { path: "/", component: AucationLayout, meta: { auth: true }, children: [
    { path: "", component: () => import("./features/aucations/pages/HomePage.vue") } ] },
  { path: "/:pathMatch(.*)*", component: () => import("./features/common/pages/NotFoundPage.vue") },
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  if (to.matched.some((r) => r.meta.auth) && !getAccessToken()) return "/auth/login";
  if (to.path.startsWith("/auth") && getAccessToken()) return "/";
});
export default router;
