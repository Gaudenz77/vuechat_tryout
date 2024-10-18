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
    <div class="text-center mt-8">
        <h1>Register Page</h1>
        <p>This is the register page!</p>
    </div>
    <div class="flex flex-wrap justify-center items-center">
        <div class="">
            <FormOne />
        </div>
    </div>
</template>