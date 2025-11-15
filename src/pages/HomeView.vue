<script setup>
import { Card } from 'primevue';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
const routes = ref([])
const init = async () => {
  const req = await fetch(`/menus.json?${self.crypto.randomUUID()}`)
  routes.value = await req.json()
}
onMounted(() => init())
</script>
<template>
  <div class="flex flex-col w-full min-h-dvh justify-center items-center px-5">
    <h1 class="text-3xl">
      <i class="pi pi-sitemap" style="font-size: 1.4rem;"></i>
      My Services GUI
    </h1>
    <div class="w-full max-w-[500px] my-5 flex flex-col gap-3">
      <template v-for="r in routes">
        <component :is="r.external ? 'a' : RouterLink" :href="r.external ? r.path : undefined"
          :to="r.external ? undefined : r.path">
          <Card class="border-2 border-transparent hover:border-cyan-400 duration-300 cursor-pointer">
            <template #content>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">{{ r.title }}</h2>
                <i class="pi pi-chevron-right" style="font-size: 1.2rem;"></i>
              </div>
            </template>
          </Card>
        </component>
      </template>
    </div>
  </div>
</template>
