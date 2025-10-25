<script setup>
import { Button } from "primevue";
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="flex h-dvh w-full justify-center items-center">
    <div>
      <div class="text-center">
        <h1 class="text-7xl">404</h1>
        <div class="text-uppercase">Halaman tidak ditemukan</div>
        <router-link to="/">
          <Button size="small" severity="secondary" label="kembali" />
        </router-link>
      </div>
    </div>
  </div>
</template>
