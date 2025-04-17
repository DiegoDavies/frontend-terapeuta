import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import BlogView from "../views/BlogView.vue";
import TestimonialsView from "../views/TestimonialsView.vue";
import BlogPostView from "../views/BlogPostView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/blog", component: BlogView },
  { path: "/blog/:id", component: BlogPostView },
  { path: "/depoimentos", component: TestimonialsView },
  { path: "/login", component: LoginView },
  {
    path: "/admin",
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const isAuth = !!localStorage.getItem("token");
      if (isAuth) next();
      else next("/login");
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active-link",
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
