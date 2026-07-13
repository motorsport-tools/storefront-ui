import { vPostHogCapture } from '../directives/v-posthog-capture';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.directive('posthog-capture', vPostHogCapture);
});