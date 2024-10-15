<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import ThemeToggle from './components/ThemeToggle.vue';

const isLoggedIn = ref(false);
const auth = getAuth();
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleSignout = async () => {
  await signOut(auth);
  isLoggedIn.value = false;
  router.push('/');
};
</script>

<template>
  <div>
    <div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
        <li><a><router-link to="/">Home</router-link></a></li>
        <li><a><router-link to="/secondpage" v-if="isLoggedIn">Second Page</router-link> </a></li>
        <li><a><router-link to="/about">About</router-link></a></li>
        <li><a><router-link to="/login" v-if="!isLoggedIn">Login</router-link></a></li>
        <li><a><router-link to="/register" v-if="!isLoggedIn">Register</router-link></a></li>
        <li><a>      <!-- Show Sign Out button only if the user is logged in -->
      <button class="dark:bg-pink-900 dark:text-slate-100 bg-emerald-800 text-slate-100 px-4 py-2 rounded-lg"
        @click="handleSignout" v-if="isLoggedIn">
        Sign Out
      </button></a></li>
            <li><a>    <div class="nav">
        <ThemeToggle />
        <!-- Display the ThemeToggle component -->
      </div></a></li>
    </ul>
  </div>
</div>
    <nav class="">
       |
      <!-- Only show SecondPage link if the user is logged in -->
      |
       |
       |
       |

    </nav>
    <!-- Pass user data to SecondPage -->
    <router-view :user="auth.currentUser"></router-view><!-- Displays the active component -->
  </div>
</template>

<style scoped>
.logo {
  height: 40px;
}
</style>
