<script setup lang="ts">
/* import { GoogleAuthProvider } from "firebase/auth/web-extension"; */
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup }  from 'firebase/auth'
import router from '../router' 

// Reactive form data object
let formdata = ref({
  email: '',
  password: '',
});

// Initialize Firebase Authentication
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Method to handle form submission for registration
const register = async (event: Event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formdata.value.email, formdata.value.password);
    console.log('User registered:', userCredential.user);
    alert(`User registered with email: ${formdata.value.email}`);

    // Clear the form data object after successful registration
    formdata.value.email = '';
    formdata.value.password = '';

    // Redirect to second page after successful registration
    router.push('/secondpage');
  } catch (error) {
    if (error instanceof Error) {
    console.error('Registration error:', error);
    alert('Error during registration: ' + error.message);
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
  <div class="form-container my-12 py-8">
    <form  class="dark:text-slate-100 text-slate-800">
<!--       <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
      <input
        type="text"
         class="block flex-1  rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 "
        name="firstName"
        v-model="formdata.firstName"
        placeholder="Enter your first name"
      />
      <br />
      <label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
      <input
        class="block flex-1  rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        type="text"
        name="lastName"
        v-model="formdata.lastName"
        placeholder="Enter your last name"
        required
      />
      <br /> -->

      <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-Mail</label>
      <input
         class="block flex-1  rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        type="email"
        name="email"
        v-model="formdata.email"
        placeholder="Enter your e-mail address"
        required
      />
      <br />

      <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
      <input
         class="block flex-1  rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        type="password"
        name="password"
        v-model="formdata.password"
        placeholder="Enter your password"
        required
      />
      <br />

      <div class="text-center">
        <button class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold  border-2 focus:border-green-500 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" type="submit" @click="register">Sign In</button>
        <button class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold  border-2 focus:border-green-500 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" type="submit" @click="signInWithGoogle">Sign In With Google</button>
      </div>
     
    </form>
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
