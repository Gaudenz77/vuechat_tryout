<!-- src/components/NotificationModal.vue -->
<template>
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 class="text-lg font-semibold mb-4">Enable Notifications</h2>
        <p class="mb-6">Stay updated with new messages!</p>
        <button
          @click="requestNotificationPermission"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Enable Notifications
        </button>
      </div>
    </div>
  </template>
  

  
  <style scoped>
  /* Optional styling */
  </style>
  