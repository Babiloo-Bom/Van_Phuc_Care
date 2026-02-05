/**
 * Proxy: lấy cấu hình E-Learning public (VAT %, ...) từ backend
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiHost = config.apiHostInternal || config.public?.apiHost || 'http://localhost:3000'
  const url = `${apiHost}/api/u/settings/elearning-public`
  try {
    const data = await $fetch<{ data?: { vatPercent?: number }; vatPercent?: number }>(url)
    const vatPercent = data?.data?.vatPercent ?? data?.vatPercent ?? 8
    const num = Number(vatPercent)
    const safe = Number.isFinite(num) && num >= 0 && num <= 100 ? num : 8
    return { vatPercent: safe }
  } catch {
    return { vatPercent: 8 }
  }
})
