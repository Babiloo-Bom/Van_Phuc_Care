import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#app'

/**
 * Fallback GTM loader for Nuxt 4:
 * Ensures gtm.js is injected into <head> on client even if module/plugin wiring changes.
 * Idempotent: won't inject twice if script already exists.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gtm = config.public.gtm as any

  const id = gtm?.id
  const enabled = gtm?.enabled !== false

  if (!id || !enabled) return

  const scriptId = gtm?.scriptId || 'gtm-script'

  // Avoid double-injection
  if (typeof document !== 'undefined' && document.getElementById(scriptId)) return

  // GTM loader chạy sau khi trang tương tác (defer) để giảm blocking, cải thiện FCP/LCP
  const loadGTM = () => {
    const script = document.createElement('script')
    script.id = scriptId
    script.innerHTML =
      "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':" +
      "new Date().getTime(),event:'gtm.js'});" +
      "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';" +
      "j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;" +
      "f.parentNode.insertBefore(j,f);" +
      "})(window,document,'script','dataLayer','" + id + "');"
    script.type = 'text/javascript'
    document.head.appendChild(script)
  }
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(loadGTM, { timeout: 2500 })
  } else {
    setTimeout(loadGTM, 1500)
  }

  // Giữ dataLayer init sớm để không lỗi khi code gọi gtm trước khi script load
  useHead({
    script: [
      {
        id: 'gtm-datalayer-init',
        innerHTML: "window.dataLayer=window.dataLayer||[];",
        type: 'text/javascript'
      }
    ],
    // Optional noscript fallback
    noscript: gtm?.noscript
      ? [
          {
            id: gtm?.noscriptId || 'gtm-noscript',
            innerHTML:
              `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }
        ]
      : []
  })
})


