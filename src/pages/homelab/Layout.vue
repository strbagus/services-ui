<script setup>
import { Button } from 'primevue';
import DarkMode from '@/components/DarkMode.vue';
import { RouterView } from 'vue-router';
import { ref } from 'vue';
document.title = "Homelab Dashboard"
const sidenav = ref(true)
</script>
<template>
  <div class="flex min-h-dvh">
    <!-- <Transition v-show="sidenav" name="slide">
      <aside class="w-[300px] bg-indigo-600 dark:bg-neutral-900 sticky top-0 h-dvh shadow-2xl">
        lefbar
      </aside>
    </Transition> -->
    <div class="flex flex-col w-full duration-100">
      <nav class="bg-white dark:bg-indigo-600 shadow-lg px-5 py-2 sticky top-0 z-50 flex justify-between">
        <div>
          <Button size="small" :icon="sidenav ? 'pi pi-align-left' : 'pi pi-bars'"
            @click="sidenav = !sidenav" />
        </div>
        <div>
          <DarkMode />
        </div>
      </nav>
      <main class="max-w-[1500px] mx-auto h-[2000px]">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transform: translateX(0);
  transition: transform 0.08s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
