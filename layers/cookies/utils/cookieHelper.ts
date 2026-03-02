export interface Cookie {
    name: string;
    provider?: string;
    status?: string;
    privacyPolicy?: string;
    lifespan?: string;
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
    let minimum = 365; // Default to 1 year
    cookieGroups.forEach((group) => {
        const accepted = group.cookies.filter((cookie) => cookie.accepted);
        accepted.forEach((cookie) => {
            if (cookie.lifespan) {
                const days = convertToDays(cookie.lifespan);
                if (!isNaN(days) && minimum > days) {
                    minimum = days;
                }
            }
        });
    });
    // Cap at 365 days to avoid browser rejection (Chrome caps @ 400 days)
    const lifespanInDays = Math.min(minimum, 365);
    return 60 * 60 * 24 * lifespanInDays;
};

export const cookieHelper = () => {
    return {
        getMinimumLifeSpan
    };
};