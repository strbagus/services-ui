<script setup>
import { Card } from 'primevue';
import { RouterLink } from 'vue-router';

const routes = [
  {
    title: "Homelab Monitoring",
    path: "/homelab"
  }
]
</script>
<template>
  <div class="flex flex-col w-full min-h-dvh justify-center items-center">
    <h1 class="text-3xl">
      <i class="pi pi-sitemap" style="font-size: 1.4rem;"></i>
      My Services GUI
    </h1>
    <div class="w-full max-w-[500px] my-5 flex flex-col gap-3">
      <RouterLink v-for="r in routes" :to="r.path">
        <Card>
          <template #content>
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">{{ r.title }}</h2>
              <i class="pi pi-chevron-right" style="font-size: 1.2rem;"></i>
            </div>
          </template>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
