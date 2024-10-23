<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import router from '../router';

// Reactive form data object
let formdata = ref({
  email: '',
  password: '',
  displayName: '',
  profilePic: null as File | null, // Initialize as File | null to avoid type error
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

const storage = getStorage();

// Handle file upload for the profile picture
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formdata.value.profilePic = file; // Assign the file to profilePic
  }
};

// Method to handle form submission for registration
const register = async (event: Event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, formdata.value.email, formdata.value.password);
    const user = userCredential.user;

    // Initialize photoURL to null first
    let photoURL = null;

    // If a profile picture is selected, upload it to Firebase Storage
    if (formdata.value.profilePic) {
      const storageRefPath = storageRef(storage, `profilePics/${user.uid}`);
      const snapshot = await uploadBytes(storageRefPath, formdata.value.profilePic);
      photoURL = await getDownloadURL(snapshot.ref);
    }

    // Update user profile to include displayName and photoURL
    await updateProfile(user, {
      displayName: formdata.value.displayName,
      photoURL: photoURL || '', // Use the uploaded photoURL or an empty string
    });

    console.log('User registered:', user);
    alert(`User registered with email: ${formdata.value.email}`);

    // Clear the form data object after successful registration
    formdata.value.email = '';
    formdata.value.password = '';
    formdata.value.displayName = '';
    formdata.value.profilePic = null; // Reset the profilePic field

    // Redirect to the second page after successful registration
    router.push('/secondpage');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error);
      alert('Error during registration: ' + error.message);
    }
  }
};

// Sign in with Google
const signInWithGoogle = async (event: Event) => {
  event.preventDefault();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('User signed in with Google:', user);
    alert(`User signed in with Google: ${user.displayName} (Email: ${user.email})`);

    // Optionally store user data in Firestore or display it in your chat app
    await updateProfile(user, {
      displayName: user.displayName,
      photoURL: user.photoURL || '', // Capture the Google profile picture
    });

    // Redirect to the second page
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
    <form class="dark:text-slate-100 text-slate-800">
      <!-- New file input for uploading profile picture -->
      <label for="profilePic" class="block text-sm font-medium leading-6 text-gray-900">Profile Picture</label>
      <input type="file" @change="handleFileUpload"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-300 file:text-blue-700 hover:file:bg-blue-100"
        accept="image/*" />
      <br />
      <label for="displayName" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
      <input
        class="block flex-1 w-full rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
        type="text" name="displayName" v-model="formdata.displayName" placeholder="Enter your last name" required />
      <br />

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
          type="submit" @click="register">Sign In</button>
        <button
          class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold  border-2 focus:border-green-500 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          type="button" @click="signInWithGoogle">Sign In With Google</button>
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
