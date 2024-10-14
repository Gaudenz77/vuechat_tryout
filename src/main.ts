// src/main.ts
import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import router from './router'; // Import the router
import { initializeApp } from 'firebase/app'; // Import from 'firebase/app' for frontend use
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Create the Vue application
const vueApp = createApp(App);

// Use the router
vueApp.use(router);

// Mount the app
vueApp.mount('#app');

// Export the Firestore instance for use in other files
export { db };
