export default defineNuxtPlugin(() => {

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
      key: apiKey
    })
    
    // Create and inject the script
    const script = document.createElement('script')
    script.id = 'clerk-script'
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://cdn.clerk.io/clerk.js'
  
    document.head.appendChild(script)

})