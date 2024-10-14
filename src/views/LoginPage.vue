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
    <div class="text-center mt-8">
        <h1 class="text-red-900">Login Page</h1>
        <p>This is the login page!</p>
    </div>
    <div class="flex flex-wrap justify-center items-center">
        <div class="">
            <FormTwo />
        </div>
        
    </div>
</template>