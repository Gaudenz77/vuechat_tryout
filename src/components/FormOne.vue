<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, reload } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import router from '../router';

// Initialize Firebase Authentication, Firestore, and Storage
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const provider = new GoogleAuthProvider();

// State to track password visibility
let showPassword = ref(false);

// Method to toggle password visibility
const togglePasswordVisibility2 = () => {
  showPassword.value = !showPassword.value;
};


let formdata = ref({
  email: '',
  password: '',
  displayName: '',
  profilePic: null as File | null,
});

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formdata.value.profilePic = file;
  }
};

const register = async (event: Event) => {
  event.preventDefault();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formdata.value.email, formdata.value.password);
    const user = userCredential.user;

    // Handle profile picture upload
    let photoURL = '';
    if (formdata.value.profilePic) {
      const storageRefPath = storageRef(storage, `profilePics/${user.uid}`);
      const snapshot = await uploadBytes(storageRefPath, formdata.value.profilePic);
      photoURL = await getDownloadURL(snapshot.ref);
    }

    // Update profile with displayName and photoURL
    await updateProfile(user, {
      displayName: formdata.value.displayName,
      photoURL: photoURL,
    });

    // Reload user to get updated data
    await reload(auth.currentUser!);

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), {
  displayName: formdata.value.displayName,
  email: formdata.value.email,
  photoURL: photoURL,
  createdAt: new Date(),
  status: 'offline',
  uid: user.uid, // Ensure uid is saved here
});


    // Clear form data
    formdata.value = { email: '', password: '', displayName: '', profilePic: null };

    // Redirect to the second page
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

    // Check if the user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Add the new user to Firestore if they don't already exist
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || '', // Capture the Google profile picture
        createdAt: new Date(),
        status: "offline",
      });
      console.log('User added to Firestore:', user.displayName);
    }

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
      <div class="relative">
        <input
          class="block flex-1 w-full rounded-sm focus:border-blue-300 border-2 border-solid outline-none bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
          :type="showPassword ? 'text' : 'password'" 
          name="password" v-model="formdata.password" 
          placeholder="Enter your password" required />
        <!-- Eye icon for toggling visibility -->
        <i class="fa-solid absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" 
           @click="togglePasswordVisibility2" 
           ></i>
      </div>

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
