<script>
import FormOne from '../components/FormOne.vue'

export default {
    name: 'RegisterPage',
    components: {
        FormOne
    }
}
</script>

<template>
    <div class="text-center text-black dark:text-white text-lg font-bold mt-4">
        <h1>Register Page</h1>
        <p>This is the register page!</p>
    </div>
    <div class="flex flex-wrap justify-center items-center">
        <div class=" -mt-8 md:mt-0">
            <FormOne />
        </div>
    </div>
</template>