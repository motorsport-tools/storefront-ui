export default {
    configHash: '',
    barTitle: "cookieBar.about.label",
    barDescription: "cookieBar.about.description",
    groups: [
        {
            id: "essentials",
            name: "cookieBar.essentials.label",
            description: "cookieBar.essentials.description",
            accepted: true,
            showMore: true,
            cookies: [
                {
                    name: "cookieBar.essentials.cookies.session.label",
                    provider: "cookieBar.essentials.cookies.session.provider",
                    status: "cookieBar.essentials.cookies.session.status",
                    privacyPolicy: "/privacy-policy",
                    lifespan: "Session",
                    accepted: true,
                },
                {
                    name: "cookieBar.essentials.cookies.payment.label",
                    provider: "cookieBar.essentials.cookies.payment.provider",
                    status: "cookieBar.essentials.cookies.payment.status",
                    privacyPolicy: "https://stripe.com/gb/privacy",
                    lifespan: "Session",
                    accepted: true,
                }
            ]
        },
        {
            id: "functional",
            name: "cookieBar.functional.label",
            description: "cookieBar.functional.description",
            accepted: false,
            showMore: true,
            cookies: [
                {
                    name: "cookieBar.functional.cookies.recentlyViewed.label",
                    provider: "cookieBar.functional.cookies.recentlyViewed.provider",
                    status: "cookieBar.functional.cookies.recentlyViewed.status",
                    privacyPolicy: "/privacy-policy",
                    lifespan: "100 Days",
                    accepted: false,
                },
                {
                    name: "cookieBar.functional.cookies.chat.label",
                    provider: "cookieBar.functional.cookies.chat.provider",
                    status: "cookieBar.functional.cookies.chat.status",
                    privacyPolicy: "/privacy-policy",
                    lifespan: "Session",
                    accepted: false,
                }
            ]
        }
    ]
}