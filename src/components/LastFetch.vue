<script setup>
import { ShowDate } from '@/utils/casting';
const props = defineProps(["datetime"])
</script>
<template>
  <div class="text-sm">
    Last Fetch:&nbsp;<span class="font-semibold italic">{{ ShowDate(props.datetime) }}</span>
  </div>
</template>
