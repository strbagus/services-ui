<script setup>
import { Button } from 'primevue';

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode');
  const dm = window.document.documentElement.classList.contains('dark-mode')
  window.localStorage.setItem('prefers-dark-mode', dm.toString())
}

</script>

<template>
  <Button severity="help" @click="toggleDarkMode()" size="small" icon="pi pi-sun"> </Button>
</template>
