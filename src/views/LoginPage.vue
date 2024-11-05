<script>
import FormTwo from '../components/FormTwo.vue'

export default {
    name: 'LoginPage',
    components: {
        FormTwo
    }
}
</script>

<template>
    <div>
        <div class="text-center text-black dark:text-white text-lg font-bold mt-4">
        <h1 class="text-yellow-900 dark:text-yellow-400">Login Page</h1>
        <p>This is the login page!</p>
    </div>
    <div class="flex flex-wrap justify-center items-center">
        <div class="">
            <FormTwo />
        </div>
    </div>
    </div>
    
</template>