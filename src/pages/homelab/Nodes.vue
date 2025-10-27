<script setup>
import { hlReq } from '@/utils/axios';
import { changeUnit } from '@/utils/calc';
import { Badge, Column, DataTable } from 'primevue';
import { onMounted, ref } from 'vue';

const props = defineProps(['setLoading'])
const nodes = ref({})

document.title = "Nodes - Homelab"

onMounted(() => {
  init()
})
const init = () => {
  props.setLoading(true)
  hlReq.get(`nodes`)
    .then(res => nodes.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch nodes failed: ${err}`))
    .finally(_ => props.setLoading(false))
}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Nodes</h1>
  </div>
  <div class="shadow-lg px-2">
    <DataTable :value="nodes.data">
      <Column header="Name" field="name">
        <template #body="d">
          <div>
            {{ d.data.name }}
          </div>
          <div v-if="d.data.is_control_plane">
            <Badge size="small" value="Control Plane" />
          </div>

        </template>
      </Column>
      <Column header="CPUs" field="cpus"></Column>
      <Column header="Memory">
        <template #body="d">{{ changeUnit(d.data?.memory, d.data?.memory_unit, "Gi") }} GiB</template>
      </Column>
      <Column header="Storage">
        <template #body="d">{{ changeUnit(d.data?.storage, d.data?.storage_unit, "Gi") }} GiB</template>
      </Column>
      <Column header="About">
        <template #body="d">
          <div class="text-sm">Architecture: <span class="font-bold">{{ d.data.arch }}</span></div>
          <div class="text-sm">Internal IP: <span class="font-bold">{{ d.data.internal_ip }}</span></div>
          <div class="text-sm">Kernel: <span class="font-bold">{{ d.data.kernel_version }}</span></div>
          <div class="text-sm">OS: <span class="font-bold">{{ d.data.os_image }}</span></div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
