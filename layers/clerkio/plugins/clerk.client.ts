export default defineNuxtPlugin(() => {
  // Generate a simple 8-character alphanumeric string [a-zA-Z0-9]
  const generateVisitorId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const visitorCookie = useCookie('clerk_visitor', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })

  if (!visitorCookie.value) {
    visitorCookie.value = generateVisitorId()
  }

  // Ensure this runs only in the browser
  if (typeof window === 'undefined') return


  // Avoid loading multiple times
  if (document.getElementById('clerk-script')) return

  const config = useRuntimeConfig()
  const apiKey = config.public.clerkApiKey

  // Initialize the Clerk queue
  window.__clerk_q = window.__clerk_q || []
  window.Clerk = window.Clerk || function () {
    window.__clerk_q.push(arguments)
  }

  window.Clerk('config', {
    key: apiKey,
    visitor: visitorCookie.value || 'auto',
  })

  // Create and inject the script
  const script = document.createElement('script')
  script.id = 'clerk-script'
  script.type = 'text/javascript'
  script.async = true
  script.src = 'https://cdn.clerk.io/clerk.js'

  document.head.appendChild(script)

})