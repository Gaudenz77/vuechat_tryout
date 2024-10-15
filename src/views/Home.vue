<script>
import ThemeToggle from '../components/ThemeToggle.vue'
import RangeSlider from '../components/RangeSlider.vue'


export default {
  name: 'Home',
  components: {
    ThemeToggle,
    RangeSlider,

  }
}
</script>
<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page!</p>
  </div>
  <div class="flex flex-wrap w-auto justify-center my-4">
    <div class="w-[80vw] card  bg-orange-200 rounded-lg shadow-lg p-4">
      <h1 class="text-lg text-black text-center">Welcome To the Home-Page</h1>
    </div>
  </div>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <div class="row w-full h-[150px] sticky mt-0">
      <div class="flex flex-wrap justify-center">
        <!-- <ThemeToggle /> -->
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <!-- First row, three columns -->
      <div class="flex justify-center items-center bg-gray-600 dark:bg-red-200 p-6 rounded-lg shadow-md">
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et fugiat, repudiandae possimus inventore non quam
          accusamus nam pariatur provident vero ducimus quae beatae molestiae assumenda? Minima ea ipsum enim
          consequatur?</p>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo w-16" alt="Vite logo" />
        </a>
      </div>
      <div class="flex justify-center items-center bg-gray-600 dark:bg-red-200 p-6 rounded-lg shadow-md">
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto aliquam vel ab dolore praesentium
          aliquid perferendis voluptatibus, autem blanditiis sequi facere culpa aut aperiam quisquam accusamus
          cupiditate, modi pariatur inventore?</p>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo w-16" alt="Vue logo" />
        </a>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <!-- Second row, three columns -->
      <div class="flex justify-center items-center bg-gray-600 dark:bg-red-200 p-6 rounded-lg shadow-md">
        <!-- <ThemeToggle /> -->
      </div>
      <div class="flex justify-center items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <RangeSlider />
      </div>
    </div>
  </div>
</template>

<script></script>