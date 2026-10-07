import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from "./helpers/apiHelper";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import AucationLayout from "./features/aucations/layouts/AucationLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
const routes = [
  { path: "/auth", component: AuthLayout, children: [
    { path: "login", component: LoginPage },
    { path: "register", component: RegisterPage } ] },
  { path: "/", component: AucationLayout, meta: { auth: true }, children: [
    { path: "", component: () => import("./features/aucations/pages/HomePage.vue") },
    { path: "users", component: () => import("./features/users/pages/UsersPage.vue") },
    { path: "profile", component: () => import("./features/users/pages/ProfilePage.vue") },
    { path: "aucations/:aucationId", component: () => import("./features/aucations/pages/DetailPage.vue") } ] },
  { path: "/:pathMatch(.*)*", component: () => import("./features/common/pages/NotFoundPage.vue") },
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  if (to.matched.some((r) => r.meta.auth) && !getAccessToken()) return "/auth/login";
  if (to.path.startsWith("/auth") && getAccessToken()) return "/";
});
export default router;