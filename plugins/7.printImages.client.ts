export default defineNuxtPlugin(() => {
    if (process.client) {
        window.addEventListener('beforeprint', () => {
            // 1. Force all standard images and picture sources to load eagerly
            const elements = document.querySelectorAll('img, source')
            elements.forEach((el) => {
                if (el.getAttribute('loading') === 'lazy') {
                    el.setAttribute('loading', 'eager')
                }
            })

            // 2. Fix NuxtPicture / NuxtImg data structures if they haven't hydated yet
            const dynamicImages = document.querySelectorAll('[data-src], [data-srcset]')
            dynamicImages.forEach((el) => {
                if (el.dataset.src) el.setAttribute('src', el.dataset.src)
                if (el.dataset.srcset) el.setAttribute('srcset', el.dataset.srcset)
            })
        })
    }
})