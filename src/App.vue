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
    <nav class="">
      <router-link to="/">Home</router-link> |
      <!-- Only show SecondPage link if the user is logged in -->
      <router-link to="/secondpage" v-if="isLoggedIn">Second Page</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login" v-if="!isLoggedIn">Login</router-link> |
      <router-link to="/register" v-if="!isLoggedIn">Register</router-link> |
      <!-- Show Sign Out button only if the user is logged in -->
      <button class="dark:bg-pink-900 dark:text-slate-100 bg-emerald-800 text-slate-100 px-4 py-2 rounded-lg"
        @click="handleSignout" v-if="isLoggedIn">
        Sign Out
      </button>
      <div class="nav">
        <ThemeToggle />
        <!-- Display the ThemeToggle component -->
      </div>
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
