export default defineNitroPlugin((nitroApp) => {
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err)
    })
  
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason)
    })

    nitroApp.hooks.hook('error', (error, event) => {
        console.error('Uncaught Nitro Error:', error)
    })

    nitroApp.hooks.hook('render:response', (response, { event }) => {
        if (response.statusCode >= 500) {
          console.error('Rendered 500 Error');
          console.error('Path:', event.path);
          console.error('Response:', response);

          const errorPayload = (event as any).error;
          if (errorPayload) {
            console.error('Error payload:', errorPayload);
          }
        }
      });
  })

