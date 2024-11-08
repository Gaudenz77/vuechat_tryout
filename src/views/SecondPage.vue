<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import ClickYouFate from "../components/ClickYouFate.vue";
import { getMessaging, getToken } from 'firebase/messaging';
import { useChat } from "../composables/useChat";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  getAuth,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import Swal from "sweetalert2";
import "../style.css";

// Define the user type
interface User {
  uid: string;
  displayName: string;
  photoURL?: string; // Optional photoURL
}

// State for user profile and loading
const auth = getAuth();
const user = auth.currentUser;
const profilePic = ref(user?.photoURL || "");
const displayName = ref(user?.displayName || "");
const email = ref(user?.email || "");
const loading = ref(false);
const selectedFile = ref<File | null>(null);


const showModal = ref(false);


// State for online users and chat
const onlineUsers = ref<User[]>([]);
const messageInput = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const { messages, sendMessage } = useChat();

// Props for receiving user data
const props = defineProps<{ user: any }>();



// Emoji selection handler
const onSelectEmoji = (emoji: any) => {
  if (emoji.i) {
    messageInput.value += emoji.i;
    window.history.pushState(null, "", window.location.pathname); // Close modal properly
  } else {
    console.error(
      "Selected emoji is invalid or has no recognizable character."
    );
  }
};

// Handle Enter key to send message
const handleKeyPress = (event: KeyboardEvent) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey &&
    window.location.hash !== "#emoji_modal"
  ) {
    event.preventDefault();
    handleSendMessage();
  }
};

// Reset Password Function
const resetPassword = async () => {
  if (user && user.email) {
    try {
      await sendPasswordResetEmail(auth, user.email);
      Swal.fire({
        icon: "info",
        title: "Password Reset Sent",
        text: "A password reset email has been sent to your email address.",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send reset email.");
    }
  } else {
    alert("User email not available.");
  }
};

// Firestore setup for online users
const setupOnlineUsers = () => {
  const db = getFirestore();
  const storage = getStorage();
  const q = query(collection(db, "users"), where("status", "==", "online"));

  onSnapshot(q, async (querySnapshot) => {
    onlineUsers.value = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const userData = doc.data() as User;
        userData.uid = doc.id; // Use the document ID as the uid

        // Fetch profile picture URL
        try {
          const profilePicRef = storageRef(
            storage,
            `profilePics/${userData.uid}`
          );
          userData.photoURL = await getDownloadURL(profilePicRef);
        } catch (error) {
          console.error(
            "Error fetching profile picture URL for user:",
            userData.uid,
            error
          );
          userData.photoURL = ""; // Fallback if image is not found
        }

        return userData;
      })
    );
  });
};

// Method to update user profile in Firebase
const updateProfileInfo = async () => {
  if (user) {
    loading.value = true;
    try {
      // Update profile picture if a new file is selected
      if (selectedFile.value) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageReference, selectedFile.value);
        profilePic.value = await getDownloadURL(storageReference);
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName.value,
        photoURL: profilePic.value,
      });

      // Update Firestore user document
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: displayName.value,
        photoURL: profilePic.value,
      });

      Swal.fire({
        icon: "info",
        title: "Profile Updated",
        text: "Your profile has been successfully updated!",
        confirmButtonColor: "#333",
        color: "#333",
        background: "#ffbe00",
        confirmButtonText: "OK!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      loading.value = false;
    }
  }
};

// Delete user account
const deleteAccount = async () => {
  if (
    user &&
    confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    )
  ) {
    try {
      await deleteUser(user);
      alert("Account deleted successfully.");
      // Optionally, redirect the user or handle UI updates after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account.");
    }
  }
};

// File selection handler for profile picture
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

// Send message function
const handleSendMessage = () => {
  if (messageInput.value.trim()) {
    sendMessage(messageInput.value, {
      uid: user?.uid,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
    });
    messageInput.value = "";
  }
};

// Scroll to bottom of chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Watch for new messages to trigger scroll
watch(messages, async () => {
  await nextTick();
  scrollToBottom();
});

const permissionGranted = ref(false);
const messaging = getMessaging();

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      permissionGranted.value = true;
      console.log('Notification permission granted.');

      // Retrieve FCM token
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY });
      if (token) {
        console.log('FCM Token:', token);
      } else {
        console.log('No FCM token available.');
      }
    } else {
      console.error('Notification permission denied.');
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
  }
};

// Initialize component and show modal if not previously shown
onMounted(() => {
  setupOnlineUsers();
  scrollToBottom();
  
  // Show modal only once if not previously shown
  const notificationShown = localStorage.getItem('notificationModalShown');
  if (!notificationShown) {
    Swal.fire({
      title: 'Enable Notifications',
      text: 'Stay updated with new messages!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Enable Notifications',
      cancelButtonText: 'Later',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await requestNotificationPermission();
      }
      // Save to local storage so it doesn’t show again
      localStorage.setItem('notificationModalShown', 'true');
    });
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row w-full h-[100vh] md:h-[80vh] mt-2 my-4">
    <!-- Online Users Column -->
    <!-- Modal trigger button for small screens -->
    <button @click="showModal = true" class="md:hidden p-2 bg-blue-500 text-white rounded-md mb-2">
      Show Activities
    </button>
    <!-- Modal for the left-hand column on small screens -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="w-11/12 max-w-md h-5/6 bg-[#fff248] dark:bg-[#111a3b] p-4 rounded-lg shadow-lg overflow-y-auto">
        <button @click="showModal = false" class="text-right text-gray-500 hover:text-gray-700">
          Close
        </button>
        <!-- Online Users Column Content -->

        <h1 class="text-lg font-bold text-black dark:text-white text-center">
          ACTIVITIES
        </h1>

        <h2 class="uppercase text-lg font-bold text-black dark:text-white mb-4">
          Online Users
        </h2>
        <div v-for="user in onlineUsers" :key="user.uid" class="flex items-center mb-4">
          <img v-if="user.photoURL" :src="user.photoURL" alt="User Profile" class="profile-pic" />
          <p class="ml-2 text-lg text-black dark:text-white">
            <strong>{{ user.displayName }}</strong>
          </p>
        </div>
        <hr class="mb-2" />
        <!-- User Profile Edit Section -->
        <div class="flex items-center mb-4">
          <img :src="profilePic" alt="Profile Picture" class="profile-pic w-16 h-16 rounded-full mr-4" />
          <h2 class="uppercase text-lg font-bold text-black dark:text-white">
            <strong>{{ props.user.displayName }}'s</strong> Profile
          </h2>
        </div>
        <input type="file" @change="handleFileChange"
          class="file-input file-input-bordered file-input-warning w-full max-w-xs mt-4" accept="image/*" />


        <label class="block text-black dark:text-white mt-4 mb-2">Display Name</label>
        <input v-model="displayName"
          class="w-full p-2 mb-2 rounded-md bg-gray-200 dark:bg-slate-700 dark:text-white text-black" />

        <label class="block text-black dark:text-white mt-2 mb-2">Email</label>
        <input v-model="email"
          class="w-full p-2 mb-2 rounded-md bg-gray-200 dark:bg-slate-700 dark:text-white text-black" readonly />

        <button @click="updateProfileInfo" :disabled="loading" class="btn btn-success mt-2">
          Update Profile
        </button>
        <button @click="deleteAccount" class="btn btn-danger mt-2">
          Delete Account
        </button>

        <label class="block text-black dark:text-white mt-4 mb-2">Reset Password</label>
        <!-- <input v-model="newEmail" type="email"
          class="w-full p-2 mb-2 rounded-md dark:bg-gray-200 bg-slate-700 text-gray-800 dark:text-black" />
        <button @click="changeEmail" class="btn btn-primary mt-2">Update Email</button> -->

        <button @click="resetPassword" class="btn btn-warning mt-2 mb-4">
          Reset Password
        </button>
        <ClickYouFate class="text-black dark:text-white" />
        <!-- Online Users, Profile Edit Section, etc. -->
      </div>
    </div>
    <div
      class="hidden md:block w-full h-full md:w-1/4 dark:bg-[#fff248] bg-[#111a3b] mb-4 md:mb-0 p-4 rounded-lg shadow-lg overflow-y-auto">
      <h1 class="text-lg font-bold dark:text-black text-white  text-center">
        ACTIVITIES
      </h1>
      <h2 class="uppercase text-lg font-bold dark:text-black text-white mb-4">
        Online Users
      </h2>
      <div v-for="user in onlineUsers" :key="user.uid" class="flex items-center mb-4">
        <img v-if="user.photoURL" :src="user.photoURL" alt="User Profile" class="profile-pic" />
        <p class="ml-2 text-lg dark:text-black text-white">
          <strong>{{ user.displayName }}</strong>
        </p>
      </div>
      <hr class="mb-2" />
      <!-- User Profile Edit Section -->
      <div class="flex items-center mb-4">
        <img :src="profilePic" alt="Profile Picture" class="profile-pic w-16 h-16 rounded-full mr-4" />
        <h2 class="uppercase text-lg font-bold dark:text-black text-white">
          <strong>{{ props.user.displayName }}'s</strong> Profile
        </h2>
      </div>
      <input type="file" @change="handleFileChange"
        class="file-input file-input-bordered file-input-warning w-full max-w-xs mt-4" accept="image/*" />
      <label class="block dark:text-black text-white mt-4 mb-2">Display Name</label>
      <input v-model="displayName"
        class="w-full p-2 mb-2 rounded-md bg-gray-200 dark:bg-slate-700 dark:text-white text-black" />
      <label class="block dark:text-black text-white mt-2 mb-2">Email</label>
      <input v-model="email" class="w-full p-2 mb-2 rounded-md bg-gray-200 dark:bg-slate-700 dark:text-white text-black"
        readonly />
      <button @click="updateProfileInfo" :disabled="loading" class="btn btn-success mt-2">
        Update Profile
      </button>
      <button @click="deleteAccount" class="btn btn-danger mt-2">
        Delete Account
      </button>
      <label class="block dark:text-black text-white mt-4 mb-2">Reset Password</label>
      <!-- <input v-model="newEmail" type="email"
          class="w-full p-2 mb-2 rounded-md dark:bg-gray-200 bg-slate-700 text-gray-800 dark:text-black" />
        <button @click="changeEmail" class="btn btn-primary mt-2">Update Email</button> -->
      <button @click="resetPassword" class="btn btn-warning mt-2">
        Reset Password
      </button>
      <ClickYouFate />
    </div>
    <!-- Chatbox Area (3/4 of the screen) -->
    <div
      class="w-full md:w-3/4 flex flex-col dark:bg-[#fff248] bg-[#111a3b] p-4 rounded-lg shadow-lg md:ml-4 h-4/5 md:h-full">
      <h1 class="text-lg font-bold dark:text-black text-white mb-4 text-center">
        CHATSPACE
      </h1>

      <!-- Chat messages container -->
      <div ref="chatContainer"
        class="flex-1 bg-[#111a3b] dark:bg-[#fff248] text-gray-800 rounded-lg p-4 overflow-y-auto">
        <div v-for="message in messages" :key="message.id" class="w-full flex items-start mb-4">
          <img :src="message.userPhotoURL" alt="Profile Picture" v-if="message.userPhotoURL"
            class="profile-pic my-auto" />
          <div class="flex-1">
            <div class="chat chat-start">
              <div :class="[
                'chat-bubble mt-2 pt-3 pb-4 pe-4 w-full md:w-full lg:w-3/4 ',
                message.userId === props.user.uid
                  ? 'chat-bubble-warning'
                  : 'chat-bubble-info',
              ]">
                <div class="my-auto me-4 text-sm mb-4">
                  <strong>{{ message.userName }}:</strong>
                </div>
                <p class="bubbleBreak">{{ message.text }}</p>
                <p>
                  <span class="text-xs text-gray-500">{{
                    message.createdAt
                      ? message.createdAt.toLocaleString()
                      : "Sending..."
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Message input and send button -->
      <form @submit.prevent="handleSendMessage" class="flex items-center mt-4 w-full">
        <!-- Textarea for message input -->
        <div class="relative flex-1">
          <textarea v-model="messageInput"
            class="w-full pr-16 rounded-md p-4 bg-gray-200 dark:bg-slate-700 dark:text-white text-black resize-none"
            id="message" @keydown.enter="handleKeyPress" placeholder="Type your message..."></textarea>

          <!-- Buttons inside the textarea container (positioned to the right) -->
          <div class="absolute right-2 top-2 flex space-x-2 py-2 pe-2">
            <!-- Emoji Picker Button -->
            <a href="#emoji_modal" class="text-orange-500 text-2xl p-3 rounded-full">
              <i class="fa-solid fa-face-grin-squint-tears fa-spin text-orange-500 hover:text-yellow-500 -me-2"></i>
            </a>

            <!-- Send Button -->
            <button type="submit" aria-label="Send message" class="btn btn-success rounded-full">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>

      <!-- Emoji Picker Modal -->
      <div id="emoji_modal" class="modal" role="dialog">
        <EmojiPicker :native="true" @select="onSelectEmoji" />
        <div class="modal-action">
          <a href="#" class="btn"><i class="fa-solid fa-xmark"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-pic {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
}

textarea {
  resize: none;
}

.modal-action {
  position: relative;
  bottom: 3rem;
}

.bubbleBreak {
  white-space: pre-wrap;
}

/* .swal2-container {
  background-color:'#ffbe00' !important;
} */

/* ::v-deep v3-footer {
  display: none;
} */
</style>
