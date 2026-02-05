/**
 * Trả về URL backend dùng cho Socket.IO (client phải kết nối đúng server chạy Socket.IO).
 * Ưu tiên apiHostInternal (URL server dùng để gọi backend) để client kết nối đúng server.
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const url =
    (config.public.apiBaseUrl as string) ||
    (config.public.apiHost as string) ||
    (config.apiHostInternal as string) ||
    'http://localhost:3000'
  const trimmed = (url || '').replace(/\/$/, '')
  return { url: trimmed || 'http://localhost:3000' }
})
