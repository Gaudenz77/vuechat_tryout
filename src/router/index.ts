import { createRouter, createWebHistory } from "vue-router";
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

// Add route guard to check for authentication before accessing protected routes
router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const auth = getAuth();

  if (requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next(); // User is authenticated, allow access
      } else {
        alert("You do not have access to this page. Please log in.");
        next("/login"); // Redirect to login if not authenticated
      }
    });
  } else {
    next(); // No authentication required, allow access
  }
});

export default router;
