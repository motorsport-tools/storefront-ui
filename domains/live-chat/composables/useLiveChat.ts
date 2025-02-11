import { useAuth } from "~/domains/auth/composables/useAuth";
import { onMounted } from "vue";

export const useLiveChat = async () => {

  const { user, isAuthenticated } = useAuth(); // Get user session info
  const loadLiveChat = async () => {


    if (!window.odoo) {
      window.odoo = {};
    }

    odoo.__session_info__ = Object.assign(odoo.__session_info__ || {}, {
        livechatData: {
            isAvailable: true,
            serverUrl: "https://odoo.motorsport-tools.co.uk",
            options: {
                "header_background_color": "#c81e1e", "button_background_color": "#dd1313", 
                "title_color": "#FFFFFF", 
                "button_text_color": "#FFFFFF",
                 "button_text": ".", 
                 "input_placeholder": false,
                  "default_message": "Hi Welcome to Motorsport Tools, how may I help you?", 
                  "channel_name": "motorsport-tools.co.uk", 
                  "channel_id": 1,
                  "current_partner_id": 1, 
                  "default_username": "Visitor"},
        },
    });

    // Inject Odoo's chat script dynamically
    const script = document.createElement("script");
    script.src = "https://odoo.motorsport-tools.co.uk/im_livechat/assets_embed.js";
    script.async = true;
    document.body.appendChild(script);
  };

  onMounted(() => {
    loadLiveChat();
  });

};
