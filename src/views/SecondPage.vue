<script setup lang="ts">
import { ref } from 'vue';
import ClickYouFate from '../components/ClickYouFate.vue';
import { useChat } from '../composables/useChat';

// Accept user data as a prop
const props = defineProps<{ user: any }>(); 
const { messages, sendMessage } = useChat();
const messageInput = ref('');

// Function to handle sending the message
const handleSendMessage = () => {
  if (messageInput.value.trim()) {
    sendMessage(messageInput.value, props.user); // Pass the user data to sendMessage
    messageInput.value = '';
  }
};
</script>

<template>
  <div>
    <h1>Second Page</h1>
    <p>This is the second page!</p>
    <div class="flex flex-wrap w-auto justify-center my-4">
      <div class="w-[80vw] card bg-orange-200 rounded-lg shadow-lg p-4">
        <h1 class="text-lg text-black text-center">Welcome To the Content (aka SecondPage) Page</h1>
        <ClickYouFate />
      </div>
      <div class="w-[80vw] bg-orange-200 rounded-lg shadow-lg mt-8 p-4">
        <h1 class="text-lg text-black text-center">CHATSPACE</h1>
        <form @submit.prevent="handleSendMessage" class="flex flex-col">
          <label for="message">Message:</label>
          <textarea v-model="messageInput" class="w-1/2 rounded-md m-4 p-4 text-slate-100 " id="message"></textarea>
          <div class="text-end">
            <button class="bg-blue-300 rounded-lg py-2 px-4" type="submit">Send</button>
          </div>
         
        </form>
        <div class="bg-slate-100 text-gray-800 rounded-lg p-6 "  style="overflow:scroll; height:400px;">
          <h1>Chat Room</h1>
          <div v-for="message in messages" :key="message.id">
            <p>{{ message.text }} <br />- {{ message.userId }}</p> 
            <br /><!-- Display the user's name -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Your styles here */
</style>
