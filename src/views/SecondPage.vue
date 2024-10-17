<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import ClickYouFate from "../components/ClickYouFate.vue";
import { useChat } from "../composables/useChat";
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

// Ref for message input
const messageInput = ref("");
// Function to handle emoji selection
const onSelectEmoji = (emoji: any) => {
  console.log("Selected emoji object:", emoji); // Log for debugging

  if (emoji.i) {
    messageInput.value += emoji.i; // Append the selected emoji to the input message
    // Instead of setting href, use history API to close the modal correctly
    window.history.pushState(null, '', window.location.pathname); 
  } else {
    console.error("Selected emoji is undefined or has no recognizable property for the emoji character.");
  }
};



// Accept user data as a prop
const props = defineProps<{ user: any }>();
const { messages, sendMessage } = useChat();
const chatContainer = ref<HTMLElement | null>(null); // Reference for chat container

// Handle message sending
const handleSendMessage = () => {
  if (messageInput.value.trim()) {
    sendMessage(messageInput.value, props.user); // Pass the user data to sendMessage
    messageInput.value = ""; // Clear the message input after sending
  }
};

// Handle Enter key press for sending the message
const handleKeyPress = (event: KeyboardEvent) => {
  // Ensure Enter key doesn't work inside the emoji picker
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent default form submission
    // Check if modal is open, if so, prevent message sending
    if (window.location.hash !== "#emoji_modal") {
      handleSendMessage(); // Send message only if emoji modal is not active
    }
  }
};


// Scroll to bottom function
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Watch for new messages and scroll to bottom
watch(messages, async () => {
  await nextTick(); // Wait for DOM to update
  scrollToBottom(); // Scroll to the bottom
});

// Scroll to bottom on component mount
onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div>
    <div class="flex flex-wrap w-auto justify-center my-4">
      <div class="sm:w-full md:w-[60vw] h-[9rem] bg-orange-200 rounded-lg shadow-lg p-4 pt-0">
        <h1 class="sm:text-sm md:text-lg md:font-bold mt-4 text-black text-center">
          Welcome To the Chat-Page
        </h1>
        <ClickYouFate />
      </div>
      <div class="sm:w-full md:w-[60vw] bg-orange-200 rounded-lg shadow-lg mt-2 p-4">
        <h1 class="text-lg text-black text-center">CHATSPACE</h1>

        <!-- User profile display -->
        <div v-if="props.user" class="flex items-center mb-4">
          <img v-if="props.user.photoURL" :src="props.user.photoURL" alt="User Profile" class="profile-pic" />
          <p class="ml-2 text-lg text-black">
            <strong>{{ props.user.displayName }}</strong>
          </p>
        </div>

        <!-- Chat messages container -->
        <div ref="chatContainer" class="dark:bg-zinc-900 bg-slate-100 text-gray-800 rounded-lg p-4 w-[70%] md:w-[100%] mx-auto" style="overflow-y: auto; height: 350px;">
          <div v-for="message in messages" :key="message.id" class="w-full flex items-start mb-4">
            <img :src="message.userPhotoURL" alt="Profile Picture" v-if="message.userPhotoURL" class="profile-pic my-auto" />
            <div class="flex-1">
              <div class="chat chat-start">
                <div :class="['chat-bubble mt-2 pt-3 pb-4 pe-4', message.userId === props.user.uid ? 'chat-bubble-warning' : 'chat-bubble-info']">
                  <div class="my-auto me-4 text-sm mb-4">
                      <strong>{{ message.userName }}:</strong>
                    </div>
                    {{ message.text }}
                    <p>
                      <span class="text-xs text-gray-500">{{ message.createdAt ? message.createdAt.toLocaleString() : 'Sending...' }}</span>
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- Message input and send button -->
        <form @submit.prevent="handleSendMessage" class="flex md:flex-row flex-col align-center justify-center">
          <div class="my-auto me-4">
            <h2 class="text-[1.5rem] font-bold my-auto ms-4" for="message">Message:</h2>
          </div>
          <textarea v-model="messageInput" class="sm:w-full md:w-1/2 rounded-md mt-4 mx-10 md:mx-0 p-4 text-gray-100" id="message" @keydown.enter="handleKeyPress"></textarea>
            <!-- The button to open modal for emoji selection -->
            <a style="position:relative;right:3rem;top:2rem;color:red;" href="#emoji_modal" class=""><i class="fa-solid fa-face-grin-squint-tears text-orange-500 fa-2x"></i></a>

           <!-- Emoji Picker Modal -->
          <div class="modal none" role="dialog" id="emoji_modal">
            <div class="">
              <EmojiPicker :native="false" @select="onSelectEmoji" />
              <div class="modal-action">
                <a href="#" class="btn"><i class="fa-solid fa-xmark"></i></a>
              </div>
            </div>
          </div>

          <div class="text-center md:text-end mt-0 md:mt-6 md:mx-5">
            <button type="submit" aria-label="Send message" class="btn btn-outline btn-warning !outline-none mySenderBtn" id="myBtn" abindex="0">
              <i class="fa-solid fa-paper-plane"></i>
            </button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Example CSS for profile picture styling */
.profile-pic {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.textarea {
  resize: none;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  right: 10px;
}

.message-container {
  display: flex;
  align-items: center;
}

.textChat {
  white-space: pre;
}

/* .mySenderBtn:hover {
  background-color: red;;

} */


 .modal-action {
  position: relative;
  bottom: 3rem;
 }
</style>
