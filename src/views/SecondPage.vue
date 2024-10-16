<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import ClickYouFate from "../components/ClickYouFate.vue";
import { useChat } from "../composables/useChat";

// Accept user data as a prop
const props = defineProps<{ user: any }>();
const { messages, sendMessage } = useChat();
const messageInput = ref("");
const chatContainer = ref<HTMLElement | null>(null); // Reference for chat container

// Function to handle sending the message
const handleSendMessage = () => {
  if (messageInput.value.trim()) {
    sendMessage(messageInput.value, props.user); // Pass the user data to sendMessage
    messageInput.value = "";
  }
};
// Function to handle Enter key press for sending the message
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    // Check if Enter is pressed without Shift (to allow multi-line messages)
    event.preventDefault(); // Prevent default form submission on Enter
    handleSendMessage(); // Call the send message function
  }
};

// Function to scroll to the bottom of the chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Watch messages and scroll to the bottom when a new message appears
watch(messages, async () => {
  await nextTick(); // Wait for DOM to update
  scrollToBottom(); // Scroll to the bottom when messages are updated
});

// Scroll to the bottom when the component is mounted
onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div>
    <div class="flex flex-wrap w-auto justify-center my-4">
      <div class="sm:w-full md:w-[60vw] h-[8rem] bg-orange-200 rounded-lg shadow-lg p-4 pt-0">
        <h1 class="sm:text-sm md:text-lg text-black text-center">
          Welcome To the Chat-Page
        </h1>
        <ClickYouFate />
      </div>
      <div class="sm:w-full md:w-[60vw] bg-orange-200 rounded-lg shadow-lg mt-2 p-4">
        <h1 class="text-lg text-black text-center">CHATSPACE</h1>
        <!-- Display logged-in user's profile picture and display name -->
        <div v-if="props.user" class="flex items-center mb-4">
          <img v-if="props.user.photoURL" :src="props.user.photoURL" alt="User Profile" class="profile-pic" />
          <p class="ml-2 text-lg text-black">
            <strong>{{ props.user.displayName }}</strong>
          </p>
        </div>

        <!-- Chat messages container -->
        <div ref="chatContainer" class="bg-slate-100 text-gray-800 rounded-lg p-4 w-[70%] md:w-[100%] mx-auto" style="overflow-y: auto; height: 350px;">
          <div v-for="message in messages" :key="message.id" class="w-full flex items-start mb-4">
            <!-- Profile picture -->
            <img :src="message.userPhotoURL" alt="Profile Picture" v-if="message.userPhotoURL" class="profile-pic my-auto" />

            <!-- Message content -->
            <div class="flex-1">
              <div class="chat chat-start">
                <div :class="['chat-bubble mt-2 pe-2', message.userId === props.user.uid ? 'chat-bubble-warning' : 'chat-bubble-info']">
                    {{ message.text }}
                  </div>
                </div>
            </div>

            <!-- Username -->
            <div class="ml-4 text-gray-600 relative bottom-1">
              <strong>{{ message.userName }}</strong>
              <!-- <strong>{{ message.userId }}</strong> -->
            </div>
          </div>
        </div>

        <!-- Message input and send button -->
        <form @submit.prevent="handleSendMessage" class="flex md:flex-row flex-col">
          <label class="text-lg ms-4" for="message">Message:</label>
          <textarea v-model="messageInput" class="sm:w-full md:w-1/2 rounded-md mt-4 mx-10 md:mx-0 p-4 text-gray-100 " id="message" @keydown.enter="handleKeyPress"></textarea>
          <div class="text-center md:text-end mt-0 md:mt-6">
            <button class="btn btn-outline btn-info btn-lg" id="myBtn" type="submit">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<style>
/* Example CSS for profile picture styling */
.profile-pic {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.message-container {
  display: flex;
  align-items: center;
}

.textChat {
  white-space: pre;
}
</style>
