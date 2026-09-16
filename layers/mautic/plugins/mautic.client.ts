export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  if (document.getElementById('mautic-script')) return

    // Initialize Mautic queue before loading the library.
    ; (window as any).MauticTrackingObject = 'mt'
    ; (window as any).mt =
      (window as any).mt ||
      function (...args: unknown[]) {
        ; ((window as any).mt.q = (window as any).mt.q || []).push(args)
      }

  const loadMauticScript = () => {
    if (document.getElementById('mautic-script')) return
    const script = document.createElement('script')
    script.id = 'mautic-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://mautic.motorsport-tools.co.uk/mtc.js'
    document.body.appendChild(script)
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadMauticScript, { timeout: 4000 })
  } else {
    setTimeout(loadMauticScript, 2000)
  }

  ; (window as any).mt('send', 'pageview')
})
