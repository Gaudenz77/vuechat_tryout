<script>
export default {
  name: 'Home',
  components: {
    ThemeToggle: () => import('../components/ThemeToggle.vue'), // Dynamically import ThemeToggle
    RangeSlider: () => import('../components/RangeSlider.vue'), // Dynamically import RangeSlider
  }
}
</script>
<template>
<div>
  <div class="flex flex-wrap w-full justify-center my-4 dark:bg-yellow-300 bg-blue-950 rounded-lg px-4 py-2">
<!-- Left div for image (1/3 width on small and above screens) -->
    <div class="sm:w-1/3 w-full mb-4 sm:mb-0">
      <img src="/assets/img/hero_01.png" alt="Placeholder Image" class="w-full h-auto object-cover rounded-md  sm:m-2 md:m-4  sm:p-2 md:p-4" />
    </div>
    <!-- Right div for text (2/3 width on small and above screens) -->
    <div class="sm:w-2/3 w-full mt-8 px-8">
      <div class="text-[1.5rem] font-bold dark:text-black text-white ">
        <h1>HSWIZZai - Homepage Welcomes Yalls!</h1>
        <p class="text-base text-yellow-400 dark:text-indigo-800">Welcome to this chatspace, feuturing vue3 and firebase</p>  
      </div>
      <p class="dark:text-gray-900 text-slate-100 text-base italic mt-4">
Heyhey all,<br />
In this small web-application, i provide a simple chat-page where authenticated users can exchange messages , talk about this n that, and jut exchange humen interactions.      </p>
      <p class="dark:text-gray-900 text-slate-100 text-base italic my-4">
     </p><h3 class="text-base font-bold">How to use:</h3> 
      <p class="dark:text-gray-900 text-slate-100 text-base italic mb-4">
First time visitors, please use the register link in the navbar or in the login mask to get to the registration form. there you can fill in a displayname (username), we need a e-mail address. You can use a fantasy mail address or sign up/in with Google</p>
    </div>  
  </div>
</div>


</template>

<script></script>