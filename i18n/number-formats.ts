import currency from "currency.js";

export const numberFormats = {
    "en": {
        currency: {
            style: "currency",
            currency: "GBP",
            notation: "standard",
        },
        decimal: {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
        percent: {
            style: "percent",
            useGrouping: false,
        },
    },
    "en-US": {
        currency: {
            style: "currency",
            currency: "USD",
            notation: "standard",
        },
        decimal: {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
        percent: {
            style: "percent",
            useGrouping: false,
        },
    },
} as const