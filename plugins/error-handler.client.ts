export default defineNuxtPlugin(() => {
    window.addEventListener("error", (event) => {
      const error = event.error;
  
      if (error?.message?.includes("Cannot read properties of null (reading 'ce')")) {
        console.error("Vue runtime error detected:", {
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error,
        })
  
      }
    })
  })