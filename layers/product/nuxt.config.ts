import type { Nitro } from 'nitropack/types'
import chalk from 'chalk'

export default defineNuxtConfig({
    /**
     * Hook to WARMUP redis cache on local mode development.
     */
    hooks: {
        'nitro:init': async (nitro: Nitro) => {

            if (process.env.NODE_ENV === 'development') {
                console.log('Nitro Init - on Dev')
                process.stdout.write('Start warmup stock...\n')
                const data = Array.from(Array(2300).keys())

                const formatedData = data.map((item: number) => ({
                    key: `stock:stock:product-${item}`, value: '{"1": 3}',
                }))

                await nitro.storage.setItems(formatedData)

                process.stdout.write('Finish warmup stock...\n')
            }
        },
    },
})