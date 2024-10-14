<script setup>
import { ref } from "vue";
const sliderValue = ref(50);
</script>

<template>
    <div class="">
        <input v-model="sliderValue" type="range" min="0" max="100" value="50" class="slider">
        <br />
        <input v-model="sliderValue" class="dark:bg-slate-100 bg-slate-800" type="number">
    </div>
</template>

<style scoped>
/* .slider{
    color:green;
} */
</style>
