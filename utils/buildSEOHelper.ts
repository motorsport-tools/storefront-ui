import type { Meta } from "@unhead/vue";

export interface SeoEntity {
    metaTitle?: string | null
    metaDescription?: string | null
    jsonLd?: string | object | null
    metaKeyword?: string | null
    metaImage?: string | null
    name?: string | null
    id?: string | number | null
    robots?: object | null
}

const validateSEO = (entity: SeoEntity, fullPath: string, entityType: string) => {
    if (!entity) return

    const warnings = [];

    if (!entity?.metaTitle) {
        warnings.push(
            `[WARNING] - The ${entityType} from slug ${fullPath} does not have the metaTitle.`
        );
    }
    if (!entity?.metaDescription) {
        warnings.push(
            `[WARNING] - The ${entityType} from slug ${fullPath} does not have the metaDescription.`
        );
    }
    if (!entity?.jsonLd) {
        warnings.push(
            `[WARNING] - The ${entityType} from slug ${fullPath} does not have the jsonLd.`
        );
    }
    if (!entity?.metaKeyword) {
        warnings.push(
            `[WARNING] - The ${entityType} from slug ${fullPath} does not have the metaKeyword.`
        );
    }
    if (!entity?.metaImage) {
        warnings.push(
            `[WARNING] - The ${entityType} from slug ${fullPath} does not have the metaImage.`
        );
    }

    warnings.forEach((warning) => console.warn(warning));
};

const { href } = useRequestURL()
const generateSeo = <T extends SeoEntity>(entity: T, entityType: string) => {
    if (!entity) return

    validateSEO(entity, href, entityType);
    
    const defaultTitle =
        entity.metaTitle || entity.name || `${entityType} page`;

    return {
        title: defaultTitle,
        meta: [
            {
                hid: "title",
                name: "title",
                content: entity?.metaTitle || `${entity?.name} | ${entity?.id}`,
            },
            entity?.metaDescription && {
                hid: "description",
                name: "description",
                content: entity.metaDescription || `Browsing ${entity.name} ${entityType}`,
            },
            entity?.metaDescription && {
                hid: "og:description",
                name: "og:description",
                content: entity.metaDescription || `Browsing ${entity.name} ${entityType}`,
            },
            {
                hid: "og:title",
                name: "og:title",
                content: defaultTitle,
            },
            {
                hid: "twitter:title",
                name: "twitter:title",
                content: defaultTitle,
            },
            entity?.metaDescription && {
                hid: "twitter:description",
                name: "twitter:description",
                content: entity.metaDescription || `Browsing ${entity.name} ${entityType}`,
            },
            entity?.robots && {
                hid: "robots",
                name: "robots",
                content: entity.robots
            }
        ].filter(Boolean) as Meta[],
        script: [
            entity?.jsonLd && {
                type: "application/ld+json",
                children: JSON.stringify(entity.jsonLd),
            },
        ],
    };
};

export default generateSeo;