<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-full bg-gradient-to-b from-orange-50 to-yellow-50">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
