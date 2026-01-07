<script setup>
import MenuItem from '@/components/MenuItem.vue'
import { RouterLink } from 'vue-router'
import { provide } from 'vue'

const props = defineProps({
  menuItems: Array,
  onItemClick: {
    type: Function,
    default: () => { }
  }
})

provide('listenGrandChild', () => {
  props.onItemClick()
})

</script>

<template>
  <div class="w-full bg-primary-700 dark:bg-neutral-900 flex flex-col h-full text-cyan-50">
    <div class="py-5 border-b-2 border-white">
      <h1 class="text-center font-bold text-3xl text-neutral-100">HOMELAB</h1>
      <div class="text-center text-sm mt-1 text-primary-100 dark:text-primary-300">Monitoring
        Dashboard</div>
    </div>
    <div class="flex-1 overflow-auto px-2 py-5">
      <div class="flex flex-col gap-2">
        <MenuItem v-for="item in menuItems" :key="item.route || item.label" :item="item" :level="1" />
      </div>
    </div>
    <div class="py-5 flex justify-center">
      <RouterLink to="/" @click="onItemClick">
        <div class="text-sm border border-white text-white rounded-lg py-1 px-3 hover:border-cyan-500 duration-150">
          <i style="font-size: 0.8rem;" class="pi pi-sitemap" />&nbsp;Tree View
        </div>
      </RouterLink>
    </div>
  </div>
</template>
