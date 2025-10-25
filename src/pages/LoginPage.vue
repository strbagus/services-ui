<script setup>
import { authReq } from '@/utils/axios';
import { Button, InputOtp, useToast } from 'primevue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast()
const code = ref("")
const route = useRoute()
const router = useRouter()

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await authReq.post(`signin`, { code: code.value })
    router.push(route.query.callback ? decodeURI(route.query.callback) : '/')
    toast.add({
      severity: 'success',
      summary: 'Sign in successful',
      life: 3000,
    })
  } catch (error) {
    code.value = ""
    console.error("[ERROR] error: ", error)
    if (error.code === 'ECONNABORTED') {
      toast.add({
        severity: 'warn',
        summary: 'Request Timeout',
        detail: 'Server took too long to respond. Please try again.',
        life: 3000,
      })
      return
    }
    if (error.response) {
      toast.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: error.response.data?.message || 'Code is not valid',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Connection Error',
        detail: 'Unable to reach the server.',
        life: 3000,
      })
    }
  }
}
</script>
<template>
  <div class="h-dvh w-full flex justify-center items-center">
    <div class="text-center">
      <form @submit.prevent="handleSubmit">
        <div class="text-xl mb-3 font-semibold">Enter Code</div>
        <InputOtp v-model="code" integer-only mask :length="8" />
        <Button type="submit" size="small" class="mt-3" label="Submit" :disabled="code.length != 8" />
      </form>
    </div>
  </div>
</template>
