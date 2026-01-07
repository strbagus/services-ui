<script setup>
import { Button, ProgressBar } from 'primevue';
import DarkMode from '@/components/DarkMode.vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SideMenu from '@/components/SideMenu.vue';
import { homelabRoutes } from '@/const/menu.js';
document.title = "Homelab Dashboard"
const sidenav = ref(true)
const sidenavFloat = ref(false)

const route = useRoute()
const windowWidth = ref(window.innerWidth)
const isLoading = ref(true)

const handleResize = () => {
  const w = window.innerWidth
  sidenavFloat.value = w <= 1400 ? true : false
  sidenav.value = w <= 1400 ? false : true
  windowWidth.value = w
}
onMounted(() => {
  const w = window.innerWidth
  window.addEventListener('resize', handleResize)
  sidenavFloat.value = w <= 1400 ? true : false
  sidenav.value = w <= 1400 ? false : true
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

/* const homelabMenuItems = computed(() => homelabRoutes.map(r => ({
  label: r.name,
  icon: r.icon,
  route: r.path,
  items: r.items
}))) */

const onItemClick = () => {
  if (sidenavFloat.value) {
    sidenav.value = false
  }
}

const setLoading = (loadingState) => {
  isLoading.value = loadingState
}
</script>
<template>
  <div class="flex min-h-dvh w-full">
    <Transition v-show="sidenav" name="slide">
      <aside class="max-w-[300px] w-full shadow-2xl flex flex-col"
        :class="sidenavFloat ? 'fixed z-50 h-screen' : 'sticky top-0 h-dvh'">
        <SideMenu :menu-items="homelabRoutes" :on-item-click="onItemClick" />
      </aside>
    </Transition>
    <Transition v-show="sidenav && sidenavFloat" name="opacity">
      <div class="fixed w-full h-dvh bg-black opacity-80 cursor-pointer z-40" @click="sidenav = false"></div>
    </Transition>
    <div class="flex flex-col w-full duration-100">
      <nav class="bg-white dark:bg-primary-600 shadow-lg sticky top-0 z-30">
        <div class="px-5 py-2 flex justify-between">
          <Button size="small" :icon="sidenav ? 'pi pi-align-left' : 'pi pi-bars'" @click="sidenav = !sidenav" />
          <DarkMode />
        </div>
        <div class="h-1">
          <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 100%"></ProgressBar>
        </div>
      </nav>
      <div class="max-w-[1920px] w-full  flex-1">
        <main class="max-w-[1500px] w-full mx-auto">
          <RouterView :set-loading="setLoading" />
        </main>
      </div>
      <div class="bg-neutral-100 dark:bg-neutral-900 shadow-lg py-2 text-center text-xs
        font-semibold w-full mt-5">Copyright&copy;{{ new Date().getFullYear() }}</div>
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

.opacity-enter-active,
.opacity-leave-active {
  opacity: 100%;
  transition: transform 0.08s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
