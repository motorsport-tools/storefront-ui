import type { DirectusFile } from '@directus/sdk';
import type { BlockSliderSlide } from './schema';

declare module './schema' {
    interface BlockSliderSlide {
        background_image?: DirectusFile | string | null;
    }
}