<script setup>
import { useDarkModeStore } from '@/stores/useDarkMode';
import { Button } from 'primevue';
import { onMounted } from 'vue';
const darkMode = useDarkModeStore()
const { dmToggle, init } = darkMode
onMounted(() => {
  init()
})
</script>

<template>
  <Button severity="help" @click="dmToggle" size="small" icon="pi pi-sun"> </Button>
</template>
