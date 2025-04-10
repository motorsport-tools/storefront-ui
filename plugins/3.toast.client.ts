import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    timeout: 2000,
    shareAppContext: true,
    onMounted: (_: any, toastApp: any) => {
      toastApp.use(useRouter());
    },
  });
});
