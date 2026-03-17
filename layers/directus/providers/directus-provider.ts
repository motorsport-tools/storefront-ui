// https://imgproxy.net/
import { joinURL } from 'ufo'
import { defu } from 'defu'
import { defineProvider } from '@nuxt/image/runtime'
import {
    type ImgproxyModifiers,
    type ImgproxyBaseOptions,
    operationsGenerator,
    urlSafeBase64,
    sign,
    defaultModifiers,
    resolveModifiers,
} from '~/providers/imgproxy-shared'

interface DirectusImgproxyOptions extends ImgproxyBaseOptions {
    gcsBucket: string
}

export default defineProvider<DirectusImgproxyOptions>({
    getImage: (src, { modifiers, baseURL, key, salt, gcsBucket }) => {
        const mergedModifiers = resolveModifiers(defu(modifiers, defaultModifiers))
        const gcsUrl = `gs://${gcsBucket}/uploads${src}`
        const encodedUrl = urlSafeBase64(gcsUrl)
        const path = joinURL('/', operationsGenerator(mergedModifiers), encodedUrl)
        const signature = sign(salt, path, key)

        return {
            url: joinURL(baseURL, signature, path),
        }
    }
})