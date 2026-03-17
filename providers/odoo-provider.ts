// Odoo ImgProxy Provider
import { joinURL } from 'ufo'
import { defu } from 'defu'
import { defineProvider } from '@nuxt/image/runtime'
import {
  type ImgproxyBaseOptions,
  operationsGenerator,
  urlSafeBase64,
  sign,
  defaultModifiers,
  resolveModifiers,
} from './imgproxy-shared'

interface OdooImgproxyOptions extends ImgproxyBaseOptions {
  gcsBucket: string
}

export default defineProvider<OdooImgproxyOptions>({
  getImage: (src, { modifiers, baseURL, key, salt, gcsBucket }) => {
    const mergedModifiers = resolveModifiers(defu(modifiers, defaultModifiers))
    const gcsUrl = `gs://${gcsBucket}/${src}`
    const encodedUrl = urlSafeBase64(gcsUrl)
    const path = joinURL('/', operationsGenerator(mergedModifiers), encodedUrl)
    const signature = sign(salt, path, key)

    return {
      url: joinURL(baseURL, signature, path),
    }
  }
})