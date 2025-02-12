import { onMounted } from "vue";

export const useLiveChat = async () => {


    const loadLiveChat = async () => {

        useHead({
            script: [
                {
                    type: 'text/javascript',
                    src: 'https://odoo.motorsport-tools.co.uk/im_livechat/loader/1'
                },
                {
                    type: 'text/javascript',
                    src: 'https://odoo.motorsport-tools.co.uk/im_livechat/assets_embed.js'
                }
            ]
        })
    };

  onMounted(() => {
    loadLiveChat();
  });

};