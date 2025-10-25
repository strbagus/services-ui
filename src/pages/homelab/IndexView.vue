<script setup>
import { hlReq } from '@/utils/axios';
import { Badge, Card } from 'primevue';
import { computed, onMounted, ref, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { changeUnit } from '@/utils/calc';

const { messages, live } = useWebSocket(`${import.meta.env.VITE_WS_METRIC}/metrics`);
const props = defineProps(['setLoading'])

const nodes = ref({})
const kinds = ref({})
const pods = ref({})
const top = ref([])
onMounted(() => {
  init()
})
const init = async () => {
  props.setLoading(true)
  const topPromise = hlReq.get('top')
    .then(res => top.value = res.data.nodes)
    .catch(err => console.error(`[ERROR] Fetch top failed: ${err}`))
  const nodePromise = hlReq.get('nodes')
    .then(res => nodes.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch nodes failed: ${err}`))
  const kindPromise = hlReq.get('kinds')
    .then(res => kinds.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch nodes failed: ${err}`))
  const podPromise = hlReq.get('pods')
    .then(res => pods.value = res.data)
    .catch(err => console.error(`[ERROR] Fetch nodes failed: ${err}`))

  await Promise.allSettled([topPromise, nodePromise, kindPromise, podPromise])
    .finally(() => props.setLoading(false))

}
watch(messages, (a) => top.value = a)

const mergedMetrics = computed(() => {
  return mergeByKey(nodes.value.nodes, top.value, "name")
})

const allCounter = computed(() => {
  const mg = mergedMetrics.value
  const c = {
    nodes: 0,
    cpu_usage: 0,
    cpu_cap: 0,
    mem_usage: 0,
    mem_cap: 0,
    stg_cap: 0
  }
  mg.forEach(i => {
    c.nodes++
    c.cpu_usage += i.cused / 1000
    c.cpu_cap += i.cpus
    c.mem_usage += i.mused
    c.mem_cap += i.memory
    c.stg_cap += i.storage
  })
  const mem_unit = "Gi"
  const mem_usage = changeUnit(c.mem_usage, mg[0]?.munit, mem_unit)
  const mem_cap = changeUnit(c.mem_cap, mg[0]?.memory_unit, mem_unit)
  const stg_cap = changeUnit(c.stg_cap, mg[0]?.storage_unit, mem_unit)
  const result = {
    ...c,
    cpu_usage: Number(c.cpu_usage?.toFixed(2)),
    cpu_perc: Number((c.cpu_usage / c.cpu_cap * 100)?.toFixed(2)),
    mem_perc: Number((mem_usage / mem_cap * 100)?.toFixed(2)),
    mem_usage,
    mem_cap,
    mem_unit,
    stg_cap
  }
  return result
})

const mergeByKey = (a, b, key = 'name') => {
  if (!a || !b) {
    return []
  }
  const map = new Map();
  a.forEach(item => map.set(item[key], { ...item }));
  b.forEach(item => map.set(item[key], { ...(map.get(item[key]) || {}), ...item }));
  return Array.from(map.values());
};
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Homelab Overview</h1>
    <div><i v-if="live" v-tooltip.left="'Connected to WS'" class="blink text-red-500 pi pi-circle-fill"></i></div>
  </div>
  <div class="flex flex-wrap justify-center">
    <div class="w-full sm:w-1/2 md:w-1/3 p-2">
      <Card>
        <template #content>
          <div class="flex items-end gap-2">
            <div class="text-7xl font-bold">{{ allCounter.nodes || 0 }}</div>
            <div class="text-xl font-bold">Nodes</div>
          </div>
          <div class="mt-3 font-semibold">{{ allCounter.nodes || 0 }} {{ allCounter.nodes > 1 ?
            'nodes' : 'node' }} is running.</div>
        </template>
      </Card>
    </div>
    <div class="w-full sm:w-1/2 md:w-1/3 p-2">
      <Card>
        <template #content>
          <div class="flex items-end gap-2">
            <div class="text-7xl font-bold">{{ allCounter.cpu_cap || 0 }}</div>
            <div class="text-xl font-bold">CPUs Core</div>
          </div>
          <div class="mt-3 font-semibold">
            {{ `${allCounter.cpu_usage}/${allCounter.cpu_cap} (${allCounter.cpu_perc}%)` }} cores is used.
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card>
        <template #content>
          <div class="flex items-end gap-2">
            <div class="text-7xl font-bold">{{ `${allCounter.mem_cap} GiB` }}</div>
            <div class="text-xl font-bold">Memory</div>
          </div>
          <div class="mt-3 font-semibold">
            {{ `${allCounter.mem_usage}/${allCounter.mem_cap} GiB (${allCounter.mem_perc}%)` }} memory is used.
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card>
        <template #content>
          <div class="flex items-end gap-2">
            <div class="text-7xl font-bold">{{ `${pods.nodes ? pods.nodes.length : 0}` }}</div>
            <div class="text-xl font-bold">Pods</div>
          </div>
          <div class="mt-3 font-semibold">
            {{ `${pods.nodes ? pods.nodes.length : 0} pods across ${kinds.nodes ? kinds.nodes.length : 0}
            types.` }}
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card>
        <template #content>
          <div class="flex items-end gap-2">
            <div class="text-7xl font-bold">{{ `${allCounter.stg_cap} GiB` }}</div>
            <div class="text-xl font-bold">Total Disk</div>
          </div>
          <div class="mt-3 font-semibold">
            {{ `${allCounter.stg_cap} GiB disk capacity across ${allCounter.nodes} nodes.` }}
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div class="text-xl text-center mt-5 font-semibold">NODES</div>
  <div class="flex flex-wrap justify-evenly">
    <div v-for="d in mergedMetrics" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card>
        <template #title>
          <div class="text-center flex items-center justify-center gap-2">{{ d.name }}
            <Badge v-if="d.roles?.includes('master')" size="small" style="text-align:
            center;">master</Badge>
          </div>
        </template>
        <template #content>
          <div class="font-semibold">{{ `CPU: ${(d.cused / 1000).toFixed(2)} /
            ${d.cpus} cores (${d.cperc}%)` }}</div>
          <div class="font-semibold">{{ `MEM: ${changeUnit(d.mused, d.munit, "Gi").toFixed(2)} / ${changeUnit(d.memory,
            d.memory_unit, "Gi")} GiB
            (${d.mperc}%)` }}</div>
          <div class="font-semibold">{{ `Disk Cap: ${changeUnit(d.storage, d.storage_unit, "Gi")} GiB` }}</div>
          <hr class="my-2" />
          <div class="text-sm">{{ `Internal IP: ${d.internal_ip}` }}</div>
          <div class="text-sm">{{ `Kernel: ${d.kernel_version}` }}</div>
          <div class="text-sm">{{ `Image: ${d.os_image}` }}</div>
        </template>
      </Card>
    </div>
  </div>
</template>
<style scoped>
.blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
