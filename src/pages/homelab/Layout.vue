<script setup>
import { Button, ProgressBar } from 'primevue';
import DarkMode from '@/components/DarkMode.vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { onBeforeUnmount, onMounted, ref } from 'vue';
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

const homelabRoutes = [
  {
    name: "Overview",
    icon: "pi pi-objects-column",
    path: "/homelab"
  },
  {
    name: "Nodes",
    icon: "pi pi-desktop",
    path: "/homelab/nodes"
  },
  {
    name: "Pods",
    icon: "pi pi-server",
    path: "/homelab/pods"
  },
  {
    name: "Services",
    icon: "pi pi-sparkles",
    path: "/homelab/services"
  },
]
const setLoading = (loadingState) => {
  isLoading.value = loadingState
}
</script>
<template>
  <div class="flex min-h-dvh w-full">
    <Transition v-show="sidenav" name="slide">
      <aside class="max-w-[300px] w-full bg-indigo-600 dark:bg-neutral-900 shadow-2xl flex flex-col"
        :class="sidenavFloat ? 'fixed z-50 h-screen' : 'sticky top-0 h-dvh'">
        <div class="py-5 border-b-2">
          <h1 class="text-center font-bold text-3xl text-neutral-100">HOMELAB</h1>
          <div class="text-center text-sm mt-1 text-cyan-100 dark:text-cyan-300">Monitoring
            Dashboard</div>
        </div>
        <ul class="flex-1 overflow-auto px-2 py-5">
          <RouterLink v-for="r in homelabRoutes" :to="r.path" :key="r.path" @click="sidenavFloat &&
          (sidenav = false)">
            <li class="my-2 route px-3 rounded-lg py-1 text-cyan-50 duration-200" :class="route.path == r.path &&
              'active-route'"><i :class="r.icon" /> {{ r.name }}</li>
          </RouterLink>
        </ul>
      </aside>
    </Transition>
    <Transition v-show="sidenav && sidenavFloat" name="opacity">
      <div class="fixed w-full h-dvh bg-black opacity-80 cursor-pointer z-40" @click="sidenav = false"></div>
    </Transition>
    <div class="flex flex-col w-full duration-100">
      <nav class="bg-white dark:bg-indigo-600 shadow-lg px-5 py-2 sticky top-0 z-30 flex justify-between">
        <div>
          <Button size="small" :icon="sidenav ? 'pi pi-align-left' : 'pi pi-bars'" @click="sidenav = !sidenav" />
        </div>
        <div>
          <DarkMode />
        </div>
      </nav>
      <ProgressBar v-if="isLoading" mode="indeterminate" style="height: 3px"></ProgressBar>
      <div v-else style="height: 3px"></div>
      <main class="max-w-[1500px] w-full mx-auto flex-1">
        <RouterView :set-loading="setLoading" />
      </main>
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

.active-route,
.route:hover {
  color: var(--color-cyan-300);

  box-shadow: inset 0 -2px #ffffff;
}

.active-route {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
