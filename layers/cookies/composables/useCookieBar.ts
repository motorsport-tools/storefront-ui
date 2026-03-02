import { cookieHelper, type Cookie, type CookieGroup, type CookieBarConfig } from "../utils/cookieHelper"
import { useCookieConsent } from "./useCookieConsent"
import { useSha256 } from "./useHash"

const checkIfScriptIsExternal = (scriptName: string) => {
    return scriptName.startsWith("http");
};
const ESSENTIAL_COOKIE_GROUP = "cookieBar.essentials.label";

export interface CookieBarState {
    data: Partial<CookieBarConfig>;
    visible: boolean;
    manageSetting: boolean;
    loading: boolean;
}

export const useCookieBar = () => {
    const state = useState<CookieBarState>("useCookieBar", () => ({
        data: {},
        visible: false,
        manageSetting: false,
        loading: false
    }));
    const changeVisibilityState = () => state.value.visible = !state.value.visible;
    const changeManageSettingsState = () => state.value.manageSetting = !state.value.manageSetting;
    const cookieGroups = computed<CookieGroup[]>(() => (state.value.data?.groups as CookieGroup[]) || []);

    const initializeCookies = () => {
        console.log('Initializing Cookies');
        const runtimeCookies = useRuntimeConfig().public.cookieGroups as CookieBarConfig;
        console.log('Runtime Cookies', runtimeCookies);
        const { configHash, ...configWithoutHash } = runtimeCookies;
        runtimeCookies.configHash = useSha256(configWithoutHash);
        const browserCookies = useCookie<{ hash: string; groups: Record<string, Record<string, boolean>> } | null>("consent", { default: () => null });
        const browserHash = browserCookies.value?.hash ?? "";

        runtimeCookies.groups.forEach((group) => {
            group.cookies.forEach((cookie) => {
                const isAccepted = group.name === ESSENTIAL_COOKIE_GROUP || (browserCookies.value?.groups?.[group.name]?.[cookie.name] ?? false);
                if (browserCookies.value?.groups?.[group.name]?.[cookie.name] !== void 0 || group.name === ESSENTIAL_COOKIE_GROUP) {
                    cookie.accepted = isAccepted;
                    if (isAccepted && cookie.script && cookie.script.length) fetchScripts(cookie.script);
                }
                const { consent } = useCookieConsent(cookie.name);
                consent.value = isAccepted;
            });
            group.accepted = group.cookies.some((cookie) => cookie.accepted);
        });
        state.value.data = runtimeCookies;
        state.value.visible = browserHash !== runtimeCookies.configHash;
        state.value.manageSetting = false;
    };

    const setConsent = () => {
        const { getMinimumLifeSpan } = cookieHelper();
        const router = useRouter();
        const browserCookies = useCookie<{ groups: Record<string, Record<string, boolean>> } | null>("consent", { default: () => null });
        let cookieRevoke = false;

        const jsonCookie = cookieGroups.value.reduce((accumulator: Record<string, Record<string, boolean>>, group) => {
            accumulator[group.name] = group.cookies.reduce((childAccumulator: Record<string, boolean>, cookie) => {
                const currentStatus = !!browserCookies.value?.groups?.[group.name]?.[cookie.name] || false;
                const { consent } = useCookieConsent(cookie.name);
                childAccumulator[cookie.name] = cookie.accepted || false;
                consent.value = cookie.accepted || false;
                if (currentStatus && !consent.value) {
                    cookieRevoke = true;
                    removeCookies(cookie);
                }
                if (!currentStatus && consent.value && cookie.script && Array.isArray(cookie.script) && cookie.script.length)
                    fetchScripts(cookie.script);
                return childAccumulator;
            }, {});
            return accumulator;
        }, {});

        const consentCookie = useCookie("consent", {
            path: "/",
            maxAge: getMinimumLifeSpan(cookieGroups.value)
        });
        consentCookie.value = JSON.stringify({ hash: state.value.data.configHash, groups: jsonCookie });
        changeVisibilityState();
        changeManageSettingsState();
        if (cookieRevoke) router.go(0);
    };

    const setAllCookiesState = (accepted: boolean) => {
        cookieGroups.value.forEach((group) => {
            const isAccepted = group.name === ESSENTIAL_COOKIE_GROUP || accepted;
            group.accepted = isAccepted;
            group.cookies.forEach((cookie) => cookie.accepted = isAccepted);
        });
        setConsent();
    };

    const accept = (name: string) => {
        cookieGroups.value.forEach((group) => {
            group.cookies.forEach((cookie) => {
                if (cookie.name === name) {
                    cookie.accepted = true;
                    setConsent();
                }
            });
        });
    };

    const removeCookies = (cookie: Cookie) => {
        if (cookie.cookieNames) {
            cookie.cookieNames.forEach((cookieName) => {
                const browserCookie = document.cookie.split(";");
                browserCookie.forEach((cookie2) => {
                    const cookiePair = cookie2.split("=");
                    if (cookiePair[0]) {
                        const name = cookiePair[0].trim();
                        if (new RegExp(cookieName).test(name)) {
                            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
                        }
                    }
                });
            });
        }
    };

    return {
        ...toRefs(state.value),
        cookieGroups,
        changeVisibilityState,
        changeManageSettingsState,
        setConsent,
        initializeCookies,
        setAllCookiesState,
        removeCookies,
        accept
    };
};

export const fetchScripts = (scripts: string[]) => {
    scripts.forEach((script) => {
        try {
            if (checkIfScriptIsExternal(script) && document) {
                const scriptElement = document.createElement("script");
                scriptElement.setAttribute("src", script);
                scriptElement.setAttribute("type", "text/javascript");
                document.head.append(scriptElement);
            }
        } catch (error) {
            console.error(error);
        }
    });
};