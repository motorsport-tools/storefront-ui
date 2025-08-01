export default defineNitroPlugin((nitroApp) => {
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err)
    })
  
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason)
    })
    
    nitroApp.hooks.hook('error', (error, event) => {
        console.error('Uncaught Nitro Error:', error)
        console.log('Event: ', event)
    })
    
    nitroApp.hooks.hook('request', (event) => {
      console.log(`[${event.method}]`, event.path)
    })
    
    nitroApp.hooks.hook('render:response', (response, { event }) => {
        const errorPayload = (event as any).error;
        if (errorPayload) {
        console.error('Error payload:', errorPayload);
        } 
    })
    
})

