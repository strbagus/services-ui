<script setup>
import { hlReq } from '@/utils/axios';
import { Card, Column, DataTable } from 'primevue';
import { onMounted, ref } from 'vue';

document.title = "Pods - Homelab"

const props = defineProps(['setLoading'])
const pods = ref({})
const kinds = ref({})

onMounted(() => {
  init()
})
const init = async () => {
  props.setLoading(true)
  const kindPromise = hlReq.get(`kinds`)
    .then(res => kinds.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch kinds failed: ${err}`))
  const podPromise = hlReq.get(`pods`)
    .then(res => pods.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch pods failed: ${err}`))
  Promise.allSettled([kindPromise, podPromise])
    .finally(() => props.setLoading(false))
}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Pods</h1>
  </div>
  <div class="flex flex-wrap justify-center">
    <div v-for="kind in kinds.data" class="p-2 w-1/2 sm:w-1/3 lg:w-1/5">
      <Card>
        <template #content>
          <div class="text-3xl font-bold">{{ kind.count }}</div>
          <div class="font-bold">{{ kind.kind }}</div>
        </template>
      </Card>
    </div>
  </div>
  <div class="px-2 mt-5 shadow-lg">
    <DataTable :value="pods.data" stripedRows>
      <Column header="Pod Name" field="name">
        <template #body="d">
          <div>
            {{ d.data.name }}
          </div>
        </template>
      </Column>
      <Column header="App Name" field="app"></Column>
      <Column header="Kind" field="kind"></Column>
      <Column header="Namespace" field="namespace"></Column>
      <Column header="Status" field="status"></Column>
      <Column header="Node" field="node"></Column>
      <Column header="References">
        <template #body="d">
          <ul>
            <li class="list-disc" v-for="r in d.data.ref">{{ `${r.kind}: ${r.name}` }}</li>
          </ul>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
