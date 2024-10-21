import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "../views/Home.vue";
import SecondPage from "../views/SecondPage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import About from "../views/About.vue";

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

// @ts-ignore
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const auth = getAuth();

  if (requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next(); // If the user is authenticated, allow access to the route
      } else {
        alert("You do not have access to this page. Please log in.");
        next("/login"); // Redirect to login if not authenticated
      }
    });
  } else {
    next(); // If the route doesn't require authentication, allow access
  }
}); 


export default router;
