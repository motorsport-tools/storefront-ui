import type { DirectusFile } from '@directus/sdk';
import type { BlockSliderSlide, BlockLunchbox, BlockImage } from './schema';

declare module './schema' {
    interface BlockSliderSlide {
        background_image?: DirectusFile | string | null;
    }
    interface BlockLunchbox {
        layout: 1 | 2 | 3 | 4;
    }
    interface BlockImage {
        image?: DirectusFile | string | null
    }
}