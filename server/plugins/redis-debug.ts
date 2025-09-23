export default defineNitroPlugin(() => {
    const storage = useStorage().getMounts()
    //console.log('Available mounts:', storage)

    for (const store of storage) {
        console.log('Storage: ' + store.base + ' = ', store.driver.options)
    }
})