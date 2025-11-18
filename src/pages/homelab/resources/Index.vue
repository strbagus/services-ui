<script setup>
import { useReqMetric } from '@/composables/useReqMetric';
import { Card } from 'primevue';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
const props = defineProps(['setLoading'])
const { data: resources, fetchData: fetchResources } = useReqMetric()
onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  props.setLoading(true)
  fetchResources('resources')
    .finally(() => props.setLoading(false))

}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Resources</h1>
  </div>
  <div class="flex flex-wrap justify-center items-stretch">
    <div v-for="r in resources?.data" class="p-2 w-1/2 sm:w-1/3 lg:w-1/4">
      <RouterLink :to="`/homelab/resources/${r.slug}`">
      <Card class="h-full">
        <template #content>
          <div class="text-xl font-bold">{{ r.category }}</div>
          <hr class="my-2">
          <div class="font-semibold italic">{{ r.types.join(", ") }}</div>
        </template>
      </Card>
      </RouterLink>
    </div>
  </div>
</template>
