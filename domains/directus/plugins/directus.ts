import { defineNuxtPlugin } from "#app";
import { createDirectus, rest, readItem, readItems, readFile } from '@directus/sdk';

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const url = config.public.directus.url

    const directus = createDirectus(url).with(rest());

    const directusImage = (id) => {
        return `${url}/assets/${id}`
    }

    return {
        provide: { directus, readItem, readItems, directusImage },
    };
});
