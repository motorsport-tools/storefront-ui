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
    const cookieGroups = computed<CookieGroup[]>(() => {
        const groups = (state.value.data?.groups as CookieGroup[]) || [];
        return groups.map(group => {
            const { consent: groupConsent } = useCookieConsent("group_" + group.id);
            return {
                ...group,
                get accepted() { return groupConsent.value; },
                set accepted(val: boolean) { groupConsent.value = val; },
                cookies: group.cookies.map(cookie => {
                    const { consent } = useCookieConsent(cookie.name);
                    return {
                        ...cookie,
                        get accepted() { return consent.value; },
                        set accepted(val: boolean) { consent.value = val; }
                    };
                })
            } as CookieGroup;
        });
    });

    const initializeCookies = () => {
        const runtimeCookiesConfig = useRuntimeConfig().public.cookieGroups as CookieBarConfig;
        const browserCookies = useCookie<{ hash: string | undefined; groups: Record<string, Record<string, boolean>> } | null>("consent", {
            default: () => null,
            path: "/"
        });

        const hasConsent = !!(browserCookies.value && typeof browserCookies.value === 'object' && browserCookies.value.groups);
        const browserHash = (browserCookies.value && typeof browserCookies.value === 'object') ? (browserCookies.value.hash ?? "") : "";

        // Generate hash from config if not provided
        const configHash = runtimeCookiesConfig.configHash || useSha256(runtimeCookiesConfig.groups);

        runtimeCookiesConfig.groups.forEach((group) => {
            let groupHasAccepted = false;
            group.cookies.forEach((cookie) => {
                const isAccepted = group.name === ESSENTIAL_COOKIE_GROUP || (browserCookies.value?.groups?.[group.name]?.[cookie.name] ?? false);
                const { consent } = useCookieConsent(cookie.name);
                consent.value = isAccepted;
                if (isAccepted) {
                    groupHasAccepted = true;
                    if (cookie.script && cookie.script.length) fetchScripts(cookie.script);
                }
            });
            const { consent: groupConsent } = useCookieConsent("group_" + group.id);
            groupConsent.value = groupHasAccepted;
        });

        state.value.data = runtimeCookiesConfig;

        // SSR should NOT open by default at start so it doesn't flash pop open
        if (!import.meta.server) {
            state.value.visible = !hasConsent || (configHash !== "" && browserHash !== configHash);
            state.value.manageSetting = false;
        } else {
            // Server-side: always hidden
            state.value.visible = false;
        }
    };

    onMounted(() => {
        initializeCookies();
    });

    const setConsent = () => {
        const { getMinimumLifeSpan } = cookieHelper();
        const router = useRouter();
        const browserCookies = useCookie<{ hash: string | undefined; groups: Record<string, Record<string, boolean>> } | null>("consent", {
            default: () => null,
            path: "/"
        });
        let cookieRevoke = false;

        const jsonCookie = cookieGroups.value.reduce((accumulator: Record<string, Record<string, boolean>>, group) => {
            accumulator[group.name] = group.cookies.reduce((childAccumulator: Record<string, boolean>, cookie) => {
                const currentStatus = !!browserCookies.value?.groups?.[group.name]?.[cookie.name] || false;
                childAccumulator[cookie.name] = cookie.accepted;

                if (currentStatus && !cookie.accepted) {
                    cookieRevoke = true;
                    removeCookies(cookie);
                }
                if (!currentStatus && cookie.accepted && cookie.script && Array.isArray(cookie.script) && cookie.script.length)
                    fetchScripts(cookie.script);

                return childAccumulator;
            }, {});
            return accumulator;
        }, {});

        const consentCookie = useCookie<{ hash: string | undefined; groups: Record<string, Record<string, boolean>> } | null>("consent", {
            path: "/",
            maxAge: getMinimumLifeSpan(cookieGroups.value)
        });
        const configHash = state.value.data.configHash || useSha256(state.value.data.groups || []);
        consentCookie.value = { hash: configHash, groups: jsonCookie };
        state.value.visible = false;
        state.value.manageSetting = false;
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