<script setup lang="ts">

</script>
<template>
<!-- <div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a><router-link to="/">Home</router-link></a></li>
        <li><a><router-link to="/secondpage" v-if="isLoggedIn">Second Page</router-link> </a></li>
        <li><a><router-link to="/about">About</router-link></a></li>
        <li><a><router-link to="/login" v-if="!isLoggedIn">Login</router-link></a></li>
        <li><a><router-link to="/register" v-if="!isLoggedIn">Register</router-link></a></li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    <a class="btn btn-ghost text-xl">CHat-CHannel-SWITZERLAND</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
        <li><a><router-link to="/">Home</router-link></a></li>
        <li><a><router-link to="/secondpage" v-if="isLoggedIn">Second Page</router-link> </a></li>
        <li><a><router-link to="/about">About</router-link></a></li>
        <li><a><router-link to="/login" v-if="!isLoggedIn">Login</router-link></a></li>
        <li><a><router-link to="/register" v-if="!isLoggedIn">Register</router-link></a></li>
        <li><a>Item 3</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <div class="relative bottom-[0.5rem]">
                <button class="dark:bg-success dark:text-slate-100 bg-error text-slate-100 px-4 py-2 rounded-lg"
                  @click="handleSignout" v-if="isLoggedIn">
                  Sign Out
                </button>
              </div>
              <div class="relative bottom-[0.25rem]">
                <ThemeToggle />
                
              </div>
              <div v-if="isLoggedIn && user?.photoURL" class="ml-4">
          <img :src="user.photoURL" alt="User Profile" class="w-10 h-10 rounded-full" />
        </div>
  </div>
</div> -->

<!-- Own Navbar -->
<!-- <div class="navbar bg-base-100 dark:bg-[#010831] dark:text-white text-black">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">CHat-CHannel-SWITZERLAND</a>
      </div>
      <div class="">
        <ul class="flex flex-wrap align-middle gap-4 pt-4">
          <li><a><router-link to="/">Home</router-link></a></li>
          <li><a><router-link to="/secondpage" v-if="isLoggedIn">Second Page</router-link> </a></li>
          <li><a><router-link to="/about">About</router-link></a></li>
          <li><a><router-link to="/login" v-if="!isLoggedIn">Login</router-link></a></li>
          <li><a><router-link to="/register" v-if="!isLoggedIn">Register</router-link></a></li>
          <li><a> 
              <div class="relative bottom-[0.5rem]">
                <button class="dark:bg-success dark:text-slate-100 bg-error text-slate-100 px-4 py-2 rounded-lg"
                  @click="handleSignout" v-if="isLoggedIn">
                  Sign Out
                </button>
              </div>
            </a></li>
          <li><a>
              <div class="relative bottom-[0.25rem]">
                <ThemeToggle />
                
              </div>
            </a></li>
        </ul>
        <div v-if="isLoggedIn && user?.photoURL" class="ml-4">
          <img :src="user.photoURL" alt="User Profile" class="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div> -->

</template>