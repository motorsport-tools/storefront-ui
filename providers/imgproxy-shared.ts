// Shared ImgProxy utilities for multiple providers
import { joinURL } from 'ufo'
import { hmac } from '@noble/hashes/hmac.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { defu } from 'defu'
import type { ImageModifiers } from '@nuxt/image'
import { createOperationsGenerator } from '@nuxt/image/runtime'

// https://docs.imgproxy.net/usage/processing#resizing-type
export type ImgproxyResizingType = 'fit' | 'fill' | 'fill-down' | 'force' | 'auto'

export type ImgproxyGravityType = 'ce' | 'no' | 'so' | 'ea' | 'we' | 'noea' | 'nowe' | 'soea' | 'sowe'

export interface ImgproxyCrop {
    width: number
    height: number
    gravity?: ImgproxyGravityType
}

export type ImgproxyFormat = 'webp' | 'png' | 'jpg' | 'jpeg' | 'jxl' | 'avif' | 'gif' | 'ico' | 'svg' | 'heic' | 'bmp' | 'tiff' | 'pdf' | 'psd' | 'mp4'

export type ImgproxyBooleanPrimitive = string | number | boolean | 't'

export interface ImgproxyModifiers extends Omit<ImageModifiers, 'fit' | 'format' | 'background' | 'resize' | 'width' | 'height'> {
    width: number
    height: number
    format: ImgproxyFormat
    fit: ImgproxyResizingType | 'contain'
    resizingType: ImgproxyResizingType
    resize: string
    size: string
    minWidth: number
    minHeight: number
    zoom: string | number
    dpr: number
    enlarge: boolean
    extend: boolean
    extendAspectRatio: string
    gravity: ImgproxyGravityType | string
    crop: ImgproxyCrop
    autoRotate: boolean
    rotate: number
    background: string
    sharpen: number
    pixelate: number
    stripMetadata: boolean
    keepCopyright: boolean
    stripColorProfile: boolean
    enforceThumbnail: boolean
    maxBytes: number
    raw: boolean
    cachebuster: string
    expires: number
    filename: string
    returnAttachment: boolean
    preset: string
    maxSrcResolution: number
    maxSrcFileSize: number
    maxAnimationFrames: number
    maxAnimationFrameResolution: string
    maxResultDimension: string
}

export interface ImgproxyBaseOptions {
    baseURL: string
    salt: string
    key: string
    modifiers?: Partial<ImgproxyModifiers>
}

const booleanMap = (value: string | number | boolean | ImgproxyCrop | ImgproxyBooleanPrimitive): number => {
    if (typeof value === 'boolean') {
        return value ? 1 : 0
    }

    if (typeof value === 'object') {
        return 0
    }

    switch (value) {
        case 't':
        case 1:
        case 'true':
            return 1
        default:
            return 0
    }
}

// https://docs.imgproxy.net/usage/processing
export const operationsGenerator = createOperationsGenerator<keyof ImgproxyModifiers, string | number | boolean | ImgproxyCrop | ImgproxyBooleanPrimitive, string, string | boolean | number>({
    keyMap: {
        resize: 'rs',
        size: 's',
        resizingType: 'rt',
        width: 'w',
        height: 'h',
        minWidth: 'mw',
        minHeight: 'mh',
        zoom: 'z',
        dpr: 'dpr',
        enlarge: 'el',
        extendAspectRatio: 'exar',
        gravity: 'g',
        crop: 'c',
        autoRotate: 'ar',
        rotate: 'rot',
        background: 'bg',
        blur: 'bl',
        sharpen: 'sh',
        pixelate: 'pix',
        stripMetadata: 'sm',
        keepCopyright: 'kcr',
        stripColorProfile: 'scp',
        enforceThumbnail: 'eth',
        quality: 'q',
        maxBytes: 'mb',
        format: 'f',
        raw: 'raw',
        cachebuster: 'cb',
        expires: 'exp',
        filename: 'fn',
        returnAttachment: 'att',
        preset: 'pr',
        maxSrcResolution: 'msr',
        maxSrcFileSize: 'msfs',
        maxAnimationFrames: 'maf',
        maxAnimationFrameResolution: 'mafr',
        maxResultDimension: 'mrd',
    },
    valueMap: {
        crop: (value: string | number | boolean | ImgproxyCrop | ImgproxyBooleanPrimitive): string => {
            if (typeof value === 'string') {
                return value
            }

            if (typeof value === 'object') {
                return `${value.width}:${value.height}${value?.gravity ? `:${value.gravity}` : ''}`
            }

            throw new Error('Wrong crop format')
        },
        enlarge: booleanMap,
        extend: booleanMap,
        autoRotate: booleanMap,
        stripMetadata: booleanMap,
        keepCopyright: booleanMap,
        stripColorProfile: booleanMap,
        enforceThumbnail: booleanMap,
        raw: booleanMap,
        returnAttachment: booleanMap,
        rotate: (value): number => {
            if (typeof value !== 'number' || value <= 0 || value >= 359) {
                throw new TypeError('Wrong rotate format')
            }

            return value - (value % 90)
        },
    },
    formatter: (key, value) => `${key}:${value}`,
    joinWith: '/',
})

function hexToBytes(hex: string): Uint8Array {
    if (!hex || hex.length % 2 !== 0 || !/^[\da-f]+$/i.test(hex)) {
        throw new TypeError('Imgproxy key/salt must be a non-empty even-length hex string')
    }
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
    }
    return bytes
}

export function urlSafeBase64(input: string | Uint8Array): string {
    const bytes = typeof input === 'string'
        ? new TextEncoder().encode(input)
        : input

    const binaryString = String.fromCharCode(...bytes)
    const base64 = btoa(binaryString)

    return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}

export function sign(salt: string, target: string, secret: string) {
    const signature = hmac.create(sha256, hexToBytes(secret))
    signature.update(hexToBytes(salt))
    signature.update(new TextEncoder().encode(target))

    return urlSafeBase64(signature.digest())
}

export const defaultModifiers: Partial<ImgproxyModifiers> = {
    resizingType: 'fit',
    gravity: 'ce',
    enlarge: true,
    extend: true,
    background: 'ffffff',
    format: 'webp',
}

export function resolveModifiers(modifiers: Partial<ImgproxyModifiers>): Partial<ImgproxyModifiers> {
    if (modifiers?.fit) {
        switch (modifiers.fit) {
            case 'contain':
                modifiers.resizingType = 'fill'
                break
            case 'cover':
                modifiers.resizingType = 'fill'
                break
            case 'inside':
                modifiers.resizingType = 'fit'
                break
            case 'outside':
                modifiers.resizingType = 'fill-down'
                break
            default:
                modifiers.resizingType = modifiers.fit
                break
        }
        delete modifiers.fit
    }

    return modifiers
}