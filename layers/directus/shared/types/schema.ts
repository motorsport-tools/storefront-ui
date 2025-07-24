
export interface ExtensionSeoMetadata {
    title?: string;
    meta_description?: string;
    og_image?: string;
    additional_fields?: Record<string, unknown>;
    sitemap?: {
        change_frequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
        priority: string;
    };
    no_index?: boolean;
    no_follow?: boolean;
}

export interface Globals {
	/** @primaryKey */
	id: number;
	social_links?: Array<{ url: string; service: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok' }> | null;
	/** @description Public URL for the website */
	url?: string | null;
}

export interface Page {
	/** @primaryKey */
	id: number;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	seo?: ExtensionSeoMetadata | null;
	/** @description Unique URL - must start with can have multiple segments i.e. /about/company @required */
	permalink: string;
	/** @required */
	title: string;
	sections?: string;
}

export interface PageSection {
	/** @primaryKey */
	id: number;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	/** @required */
	title: string;
	full_width?: boolean | null;
	color?: string | null;
	/** @required */
	align_items: `flex-start` | 'center' | `flex-end`;
	/** @required */
	justify_content: `flex-start` | 'center' | `flex-end` | `space-around` | `space-between` | `space-evenly` | 'stretch';
	/** @required */
	background_color: string;
}

export interface DirectusCollection {
	/** @primaryKey */
	collection: string;
	icon?: string | null;
	note?: string | null;
	display_template?: string | null;
	hidden?: boolean;
	singleton?: boolean;
	translations?: Array<{ language: string; translation: string; singular: string; plural: string }> | null;
	archive_field?: string | null;
	archive_app_filter?: boolean;
	archive_value?: string | null;
	unarchive_value?: string | null;
	sort_field?: string | null;
	accountability?: 'all' | 'activity' | null | null;
	color?: string | null;
	item_duplication_fields?: 'json' | null;
	sort?: number | null;
	group?: DirectusCollection | string | null;
	collapse?: string;
	preview_url?: string | null;
	versioning?: boolean;
}

export interface DirectusField {
	/** @primaryKey */
	id: number;
	collection?: DirectusCollection | string;
	field?: string;
	special?: string[] | null;
	interface?: string | null;
	options?: 'json' | null;
	display?: string | null;
	display_options?: 'json' | null;
	readonly?: boolean;
	hidden?: boolean;
	sort?: number | null;
	width?: string | null;
	translations?: 'json' | null;
	note?: string | null;
	conditions?: 'json' | null;
	required?: boolean | null;
	group?: DirectusField | string | null;
	validation?: 'json' | null;
	validation_message?: string | null;
}

export interface DirectusRelation {
	/** @primaryKey */
	id: number;
	many_collection?: string;
	many_field?: string;
	one_collection?: string | null;
	one_field?: string | null;
	one_collection_field?: string | null;
	one_allowed_collections?: string[] | null;
	junction_field?: string | null;
	sort_field?: string | null;
	one_deselect_action?: string;
}

export interface DirectusTranslation {
	/** @primaryKey */
	id: string;
	/** @required */
	language: string;
	/** @required */
	key: string;
	/** @required */
	value: string;
}

export interface Schema {
	globals: Globals;
	Pages: Page[];
	page_sections: PageSection[];
	directus_collections: DirectusCollection[];
	directus_fields: DirectusField[];
	directus_relations: DirectusRelation[];
	directus_translations: DirectusTranslation[];
}

export enum CollectionNames {
	globals = 'globals',
	Pages = 'Pages',
	page_sections = 'page_sections',
	directus_collections = 'directus_collections',
	directus_fields = 'directus_fields',
	directus_relations = 'directus_relations',
	directus_translations = 'directus_translations'
}