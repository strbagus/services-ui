import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useWebSocket(url) {
  const socket = ref(null)
  const messages = ref({})
  const live = ref(false)

  const connect = () => {
    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      live.value = true
      console.log('[WS] connected')
    }
    socket.value.onmessage = (event) => {
      messages.value = JSON.parse(event.data)
    }
    socket.value.onerror = (err) => console.error('[WS] error', err)
    socket.value.onclose = () => {
      live.value = false
      console.log('[WS] closed')
    }
  }

  const send = (data) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(data))
    }
  }

  onMounted(connect)
  onBeforeUnmount(() => socket.value?.close())

  return { messages, live, send }
}
