export interface Cookie {
    name: string;
    provider?: string;
    status?: string;
    privacyPolicy?: string;
    Lifespan?: string;
    accepted: boolean;
    script?: string[];
    cookieNames?: string[];
}

export interface CookieGroup {
    id: string;
    name: string;
    description: string;
    accepted: boolean;
    showMore: boolean;
    cookies: Cookie[];
}

export interface CookieBarConfig {
    barTitle: string;
    barDescription: string;
    groups: CookieGroup[];
    configHash: string;
}

const convertToDays = (daysInString: string | number): number => {
    if (typeof daysInString === "number") return daysInString;
    return Number.parseInt(String(daysInString).split(" ")[0]);
};

const getMinimumLifeSpan = (cookieGroups: CookieGroup[]): number => {
    let minimum = 999999;
    cookieGroups.forEach((group) => {
        const accepted = group.cookies.filter((cookie) => cookie.accepted);
        accepted.forEach((cookie) => {
            if (cookie.Lifespan && minimum > convertToDays(cookie.Lifespan)) {
                minimum = convertToDays(cookie.Lifespan);
            }
        });
    });
    return 60 * 60 * 24 * minimum;
};

export const cookieHelper = () => {
    return {
        getMinimumLifeSpan
    };
};