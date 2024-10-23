<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import ClickYouFate from "../components/ClickYouFate.vue";
import { useChat } from "../composables/useChat";
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

/* import "emoji-mart-vue-fast/css/emoji-mart.css"; */

// Define the user type
interface User {
  uid: string;
  displayName: string;
  photoURL?: string; // Optional photoURL
}

// State for online users and message input
const onlineUsers = ref<User[]>([]);
const messageInput = ref("");

// Emoji selection handler
const onSelectEmoji = (emoji: any) => {
  if (emoji.i) {
    messageInput.value += emoji.i;
    window.history.pushState(null, '', window.location.pathname); // Close modal properly
  } else {
    console.error("Selected emoji is invalid or has no recognizable character.");
  }
};

// Firestore setup for online users
onMounted(() => {
  const db = getFirestore();
  const q = query(collection(db, 'users'), where('status', '==', 'online'));

  onSnapshot(q, (querySnapshot) => {
  console.log("User querySnapshot", querySnapshot.docs.map((doc) => doc.data())); // Check the data
  onlineUsers.value = querySnapshot.docs.map((doc) => doc.data() as User);
});
});

// Props for receiving user data
const props = defineProps<{ user: any }>();

// Chat handling
const { messages, sendMessage } = useChat();
const chatContainer = ref<HTMLElement | null>(null);

// Send message and reset input
const handleSendMessage = () => {
  if (messageInput.value.trim()) {
    sendMessage(messageInput.value, props.user);
    messageInput.value = ""; // Clear input
  }
};

// Handle Enter key to send message
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey && window.location.hash !== "#emoji_modal") {
    event.preventDefault();
    handleSendMessage();
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

// Scroll to bottom on mount
onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="flex flex-col md:flex-row w-full h-[80vh] my-4">
    <!-- Online Users Column -->
    <div class="w-full md:w-1/4 dark:bg-[#fff248] bg-[#111a3b] mb-4 md:mb-0 p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 class="text-lg font-bold dark:text-black text-white mb-4">Online Users</h2>
      <div v-for="user in onlineUsers" :key="user.uid" class="flex items-center mb-4">
        <img v-if="user.photoURL" :src="user.photoURL" alt="User Profile" class="profile-pic" />
        <p class="ml-2 text-lg dark:text-black text-white"><strong>{{ user.displayName }}</strong></p>
      </div>
      <div class="">
          <ClickYouFate />
      </div>
    </div>

    <!-- Chatbox Area (3/4 of the screen) -->
    <div class="w-full md:w-3/4 flex flex-col dark:bg-[#fff248] bg-[#111a3b] p-4 rounded-lg shadow-lg md:ml-4 h-4/5 md:h-full">
      <h1 class="text-lg font-bold dark:text-black text-white mb-4 text-center">CHATSPACE -Test -New</h1>

      <!-- Chat messages container -->
      <div ref="chatContainer" class="flex-1 bg-[#111a3b] dark:bg-[#fff248] text-gray-800 rounded-lg p-4 overflow-y-auto">
        <div v-for="message in messages" :key="message.id" class="w-full flex items-start mb-4">
          <img :src="message.userPhotoURL" alt="Profile Picture" v-if="message.userPhotoURL"
            class="profile-pic my-auto" />
          <div class="flex-1">
            <div class="chat chat-start">
              <div
                :class="['chat-bubble mt-2 pt-3 pb-4 pe-4 w-full md:w-full lg:w-3/4 ', message.userId === props.user.uid ? 'chat-bubble-warning' : 'chat-bubble-info']">
                <div class="my-auto me-4 text-sm mb-4">
                  <strong>{{ message.userName }}:</strong>
                </div>
                {{ message.text }}
                <p><span class="text-xs text-gray-500">{{ message.createdAt ? message.createdAt.toLocaleString() :
                    'Sending...' }}</span></p>
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
      class="w-full pr-16 rounded-md p-4 dark:text-gray-100 bg-slate-800 resize-none"
      id="message" @keydown.enter="handleKeyPress" placeholder="Type your message..."></textarea>

    <!-- Buttons inside the textarea container (positioned to the right) -->
    <div class="absolute right-2 top-2 flex space-x-2">
      <!-- Emoji Picker Button -->
      <a href="#emoji_modal" class="text-orange-500 text-2xl p-3 rounded-full">
        <i class="fa-solid fa-face-grin-squint-tears fa-spin text-orange-800 hover:text-red-500"></i>
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
  <EmojiPicker :native="false" @select="onSelectEmoji" />
  <div class="modal-action">
    <a href="#" class="btn"><i class="fa-solid fa-xmark"></i></a>
  </div>
</div>


      <!-- Emoji Picker Modal -->
      <div id="emoji_modal" class="modal" role="dialog">
        <EmojiPicker :native="false" @select="onSelectEmoji" />
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
</style>
