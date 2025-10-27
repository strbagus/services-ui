<script setup>
import { useReqMetric } from '@/composables/useReqMetric';
import { changeUnit } from '@/utils/calc';
import { ShowDate } from '@/utils/casting';
import { Badge, Column, DataTable } from 'primevue';
import { onMounted } from 'vue';

const { data: services, fetchData: fetchServices } = useReqMetric()
const props = defineProps(['setLoading'])

document.title = "Services - Homelab"

onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  fetchServices('services')
    .finally(() => props.setLoading(false))
}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Systemd Services</h1>
  </div>
  <div class="shadow-lg px-2">
    <div class="flex justify-end mb-2">
      <div class="text-sm">
        Last fetch: <span class="italic">{{ ShowDate(services?.datetime) }}</span>
      </div>
    </div>
    <DataTable :value="services?.data">
      <Column header="PID" field="pid"></Column>
      <Column header="Name" field="name">
        <template #body="d">
          <div class="font-bold">
            {{ d.data.name }}
          </div>
          <div>
            {{ d.data.description }}
          </div>
        </template>
      </Column>
      <Column header="Memory">
        <template #body="d">{{ changeUnit(d.data?.memory, d.data?.memory_unit, "Mi") }} MiB</template>
      </Column>
      <Column header="Status">
        <template #body="d">
          <Badge :severity="d.data.is_active ? 'success' : 'danger'" :value="d.data.sub_state" />
        </template>
      </Column>
    </DataTable>

  </div>
</template>
