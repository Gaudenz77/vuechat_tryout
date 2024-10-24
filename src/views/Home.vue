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

  <div class="flex flex-wrap w-full justify-center my-4 dark:bg-yellow-300 bg-blue-950 rounded-lg px-4 py-2">
<!-- Left div for image (1/3 width on small and above screens) -->
    <div class="sm:w-1/3 w-full mb-4 sm:mb-0">
      <img src="/assets/img/hero_01.png" alt="Placeholder Image" class="w-full h-auto object-cover rounded-md  sm:m-2 md:m-4  sm:p-2 md:p-4" />
    </div>
    <!-- Right div for text (2/3 width on small and above screens) -->
    <div class="sm:w-2/3 w-full mt-8 px-8">
      <div class="text-[1.5rem] font-bold dark:text-black text-white ">
        <h1>Home Page</h1>
        <p class="">Welcome to thethe PAGES!!!</p>  
      </div>
      <p class="dark:text-gray-900 text-slate-100 mt-4">
        This is a sample text block that will take up 2/3 of the width on small and larger screens, and stack below the image on smaller screens. Use this space to provide a description or any other relevant content.
      </p>
      <p class="dark:text-gray-900 text-slate-100 my-4">
        This is a sample text block that will take up 2/3 of the width on small and larger screens, and stack below the image on smaller screens. Use this space to provide a description or any other relevant content.
      </p>
      <p class="dark:text-gray-900 text-slate-100 mb-4">
        This is a sample text block that will take up 2/3 of the width on small and larger screens, and stack below the image on smaller screens. Use this space to provide a description or any other relevant content.
      </p>
    </div>  
  </div>



  <!-- <div class="min-h-screen flex flex-col justify-center items-center">
    <div class="row w-full h-[150px] sticky mt-0">
      <div class="flex flex-wrap justify-center">
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
    
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
        
        </a>
      </div>
    </div>
Second row, three columns 
      <div class="flex justify-center items-center bg-gray-600 dark:bg-red-200 p-6 rounded-lg shadow-md">
      </div>
      <div class="flex justify-center items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <RangeSlider />
      </div>
    </div>
  </div> -->

</template>

<script></script>