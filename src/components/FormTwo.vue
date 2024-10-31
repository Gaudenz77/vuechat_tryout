<script setup lang="ts">
/* import { GoogleAuthProvider } from "firebase/auth/web-extension"; */
import { ref, defineProps } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import router from '../router'

const props = defineProps<{
  user: { displayName: string; photoURL: string; uid: string } | null;
}>();

// Reactive form data object
let formdata = ref({
  email: '',
  password: '',
});

// State to track password visibility
let showPassword = ref(false);


// Initialize Firebase Authentication
const auth = getAuth();

const provider = new GoogleAuthProvider();

// Method to toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Method to handle form submission for login
const login = async (event: Event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  try {
    const userCredential = await signInWithEmailAndPassword(auth, formdata.value.email, formdata.value.password);
    console.log('User signed in:', userCredential.user);
    alert(`User signed in with email: ${formdata.value.email}`);

    // Clear the form data object after successful login
    formdata.value.email = '';
    formdata.value.password = '';

    // Redirect to second page after successful login
    router.push('/secondpage');
  } catch (error) {
    // Ensure the error is typed as an instance of Error
    if (error instanceof Error) {
      console.error('Login error:', error);
      alert('Error during login: ' + error.message);
    } else {
      // If the error is of an unexpected type, handle it safely
      console.error('Unexpected login error:', error);
      alert('An unexpected error occurred during login.');
    }
  }
};


// Method to handle Google Sign-In
const signInWithGoogle = async (event: Event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  try {
    const result = await signInWithPopup(auth, provider);
    console.log('User signed in with Google:', result.user);
    alert(`User signed in with Google: ${result.user.email}`);

    // Redirect to second page after successful Google sign-in
    router.push('/secondpage');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Google sign-in error:', error);
      alert('Error during Google sign-in: ' + error.message);
    }
  }
};
</script>

<template>
  <div>
    <div class="form-container my-12 py-8">

    <form class="dark:text-slate-100 text-slate-800">
      <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-Mail</label>
      <input
        class="block flex-1 w-full rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        type="email" name="email" v-model="formdata.email" placeholder="Enter your e-mail address" required />
      <br />
      <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
      <!-- VISIBILITY TOOGLE SHOULD START HERE -->      
      <!-- Password input with toggle visibility -->
      <div class="relative">
        <input
          class="block flex-1 w-full rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
          :type="showPassword ? 'text' : 'password'" 
          name="password" v-model="formdata.password" 
          placeholder="Enter your password" required />
        <!-- Eye icon for toggling visibility -->
        <i class="fa-solid absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" 
           @click="togglePasswordVisibility" 
           ></i>
      </div>
      <!-- VISIBILITY TOOGLE SHOULD END HERE -->  
      <br />
      <div class="text-center">
        <button
          class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold  border-2 focus:border-green-500 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          type="submit" @click="login">Sign In</button>
        <button
          class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold  border-2 focus:border-green-500 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          type="button" @click="signInWithGoogle">Sign In With Google</button>
      </div>
    </form>
    <p class="mt-4 pt-2 dark:text-slate-100 text-slate-800">Not Registered? Go To <a href="/register">Register</a> page 
      
    </p>
  </div>
  </div>
  
</template>

<style>
/* Example form styling */
.form-container {
  border-radius: 1rem;
  padding: 2rem;
  background-color: #f2f2f2;
}
</style>
