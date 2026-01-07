<script setup>
import { listMenu, develMenu } from '@/const/menus'
import MenuItem from '@/components/MenuItem.vue'
import { computed } from 'vue';
import { Button, ConfirmDialog, useConfirm } from 'primevue'
import { useRouter } from 'vue-router';
const confirm = useConfirm()
const menus = computed(() => {
  return import.meta.env.VITE_MODE !== 'production'
    ? [...listMenu, ...develMenu]
    : [...listMenu]
})
const router = useRouter()
const logout = () => {
  confirm.require({
    message: 'Anda yakin ingin keluar?',
    header: 'Keluar',
    icon: 'pi pi-sign-out',
    rejectProps: {
      label: 'Tidak',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      severity: 'danger',
      label: 'Yakin'
    },
    accept: () => {
      window.localStorage.removeItem("some-key")
      router.replace({ name: 'auth.login' })
    }
  })
}
</script>
<template>
  <div class="flex flex-col h-full text-white">
    <div class="flex grow overflow-auto flex-col gap-1 py-3 my-3 px-2 border-y
      border-neutral-100">
      <div v-for="(m, mIdx) in menus" :key="mIdx">
        <MenuItem :item="m" />
      </div>
    </div>
    <div class="text-center py-2">
      <Button variant="outlined" severity="danger" size="small" icon="pi pi-sign-out" label="Logout"
        @click="logout()" />
    </div>
  </div>
  <ConfirmDialog />
</template>
