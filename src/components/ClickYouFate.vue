<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ClickYouFate',
  data() {
    return {
      targetString: "Hawk Thua" as string,  // The target string including the space
      currentPositions: Array(9).fill(null) as (string | null)[],  // Array to store letters (can be null initially)
      intervalId: null as ReturnType<typeof setInterval> | null,  // Use ReturnType for correct typing
      stoppedPositions: Array(9).fill(false) as boolean[]  // Tracks which positions are stopped
    };
  },
  computed: {
    displayString(): string {
      return this.currentPositions.map(pos => pos || '_').join('');  // Display the current string
    }
  },
  methods: {
    getRandomChar(): string {
      const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>? ';
      return characters[Math.floor(Math.random() * characters.length)];
    },
    startCycling(): void {
      // Clear any previous interval to prevent overlapping intervals
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }

      // Start a new interval
      this.intervalId = setInterval(() => {
        for (let i = 0; i < this.currentPositions.length; i++) {
          if (!this.stoppedPositions[i]) {
            const randomChar = this.getRandomChar();
            this.currentPositions[i] = randomChar;
            
            // If the random character matches the target character, stop the cycling for this position
            if (randomChar === this.targetString[i]) {
              this.stoppedPositions[i] = true;
            }
          }
        }
      }, 100);
    },
    stopAtPosition(): void {
      // Manually stop the next available non-stopped position
      for (let i = 0; i < this.stoppedPositions.length; i++) {
        if (!this.stoppedPositions[i]) {
          this.stoppedPositions[i] = true;
          this.currentPositions[i] = this.targetString[i];  // Set the correct character
          break;
        }
      }

      // Check if all positions are stopped, and if so, clear the interval
      if (this.stoppedPositions.every(pos => pos)) {
        if (this.intervalId !== null) {
          clearInterval(this.intervalId);
          this.intervalId = null;  // Reset the interval ID
        }
      }
    },
    resetCycling(): void {
      // Reset all positions and variables
      this.currentPositions = Array(9).fill(null);  // Reset current positions
      this.stoppedPositions = Array(9).fill(false);  // Reset stopped positions
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);  // Clear the interval if it's running
        this.intervalId = null;  // Reset intervalId
      }
    }
  }
});
</script>




<template>
  <div class="flex flex-col items-center space-y-4"> 
    <!-- Display string container -->
    <div class="text-3xl font-mono">
      <p>{{ displayString }}</p>  <!-- This is reactive and will update automatically -->
    </div>
    
    <!-- Buttons container -->
    <div class="flex justify-center space-x-4">
      <button @click="startCycling" class="px-4 py-2 bg-blue-500 text-white rounded">Start</button>
      <button @click="stopAtPosition" class="px-4 py-2 bg-red-500 text-white rounded">Stop</button>
      <button @click="resetCycling" class="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
    </div>
  </div>
</template>

  

  