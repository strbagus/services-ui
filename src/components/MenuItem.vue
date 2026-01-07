<script setup>
import { computed, inject, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import MenuItem from '@/components/MenuItem.vue'
const route = useRoute()
const props = defineProps({
  item: Object,
  level: {
    type: Number,
    default: 1
  }
})

const listenGrandChild = inject('listenGrandChild')
const isActive = (itemRoute) => itemRoute === route.path

const isOpen = ref(false)
const toggleOpen = (e) => {
  e.preventDefault()
  isOpen.value = !isOpen.value
}
const toggleCheck = (items, e) => {
  if (items)
    toggleOpen(e)
  if (props.item.route && !isExternal.value)
    listenGrandChild()
}
const isExternal = computed(() => props.item?.route?.includes("http"))

</script>

<template>
  <component :is="item.route && !isExternal ? RouterLink
    : isExternal ? 'a'
      : 'div'" v-bind="isExternal
        ? { href: item.route, target: '_blank' }
        : item.route && !isExternal
          ? { to: item.route }
          : {}"
    class="hover:text-primary-50 hover:bg-primary-600 hover:dark:bg-primary-900 duration-100 py-2 rounded cursor-pointer pr-4 flex items-center"
    :class="[
      isActive(item.route) && 'text-primary-50 font-semibold bg-primary-600 dark:bg-primary-950',
      `pl-${Math.min(level * 4, 24)}`
    ]" @click="toggleCheck(item.items, $event)">
    <i v-if="item.icon" :class="item.icon" class="mr-3" />
    <span class="flex-1">
      {{ item.label }}
      <i v-if="isExternal" class="pi pi-external-link ml-1" style="font-size: 0.65rem" />
    </span>
    <i v-if="item.items" class="pi pi-chevron-down ml-2 transition-transform duration-200"
      :class="{ 'rotate-180': isOpen }" />
  </component>

  <transition name="fade">
    <div v-if="isOpen && item.items" class="border-b border-gray-200">
      <MenuItem v-for="i in item.items" :key="i.route || i.label" :item="i" :level="level + 1" />
    </div>
  </transition>
  <div class="hidden pl-4 pl-8 pl-12 pl-16 pl-20 pl-24"></div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
