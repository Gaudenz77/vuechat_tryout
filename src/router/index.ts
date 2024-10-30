import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext, RouteRecordNormalized } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Use dynamic imports for views to enable code-splitting
const Home = () => import("../views/Home.vue");
const SecondPage = () => import("../views/SecondPage.vue");
const LoginPage = () => import("../views/LoginPage.vue");
const RegisterPage = () => import("../views/RegisterPage.vue");
const About = () => import("../views/About.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/secondpage",
    name: "SecondPage",
    component: SecondPage,
    meta: {
      requiresAuth: true, // This route requires authentication
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some((record: RouteRecordNormalized) => record.meta.requiresAuth);

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/login');
    } else {
      next();
    }
  });
});

export default router;
