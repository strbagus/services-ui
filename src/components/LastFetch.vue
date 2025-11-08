<script setup>
import { ShowDate } from '@/utils/casting';
const props = defineProps({
  datetime: String,
  refresh: Boolean
})
</script>
<template>
  <div class="text-sm">
    <button class="p-1 rounded hover:bg-primary duration-100 cursor-pointer" @click="$emit('click-event')">
      <i v-if="props.refresh" v-tooltip.bottom="'Refresh Data'" class="pi pi-refresh text-xs!" />
    </button>
    Last Fetch:&nbsp;<span class="font-semibold italic">{{ ShowDate(props.datetime) }}</span>
  </div>
</template>
