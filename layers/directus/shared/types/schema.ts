
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

export interface BlockSlider {
	/** @primaryKey */
	id: number;
	status?: 'published' | 'draft' | 'archived';
	user_created?: string | null;
	date_created?: string | null;
	user_updated?: string | null;
	date_updated?: string | null;
	/** @required */
	title: string;
	/** @description Loop - a regular carousel, Slide - with slide transition, Fade - fade transition @required */
	type: 'loop' | 'slide' | 'fade';
	/** @required */
	lazyLoad: boolean;
	ariaLabel?: string | null;
	/** @required */
	autoplay: boolean;
	/** @required */
	rewind: boolean;
	/** @description Transition speed in milliseconds. If 0 will immediately jump to the next slide @required */
	speed: number;
	/** @description Rewind transition speed in milliseconds.  @required */
	rewindSpeed: number;
	/** @description Enables navigation with the mouse wheel @required */
	wheel: boolean;
	/** @description Enables keyboard navigation  @required */
	keyboard: boolean;
	/** @description Pause the slider if mouse hover @required */
	pauseOnHover: boolean;
	/** @description Pause the slider on slide focus @required */
	pauseOnFocus: boolean;
	/** @description Show a progress bar on the slider @required */
	ShowProgress: boolean;
	/** @description Progress bar on the top or bottom @required */
	ProgressLocation: 'top' | 'bottom';
	/** @description Which slide to start on - default 0 @required */
	start: number;
	/** @description How many slides to show per page @required */
	perPage: number;
	/** @description How many slides to move at once @required */
	perMove: number;
	ProgressColor?: string | null;
	slider_slides?: BlockSliderSlide[] | string[];
}

export interface BlockSliderSlide {
	/** @primaryKey */
	id: number;
	sort?: number | null;
	user_created?: string | null;
	date_created?: string | null;
	user_updated?: string | null;
	date_updated?: string | null;
	slider?: BlockSlider | string | null;
	background_image?: DirectusFile | string | null;
}

export interface Globals {
	/** @primaryKey */
	id: number;
	social_links?: Array<{ url: string; service: 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok' }> | null;
	/** @description Public URL for the website */
	url?: string | null;
	/** @description Organization name - will show up in schema, meta and jsonLd */
	organization?: string | null;
}

export interface Page {
	/** @primaryKey */
	id: number;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	date_created?: string | null;
	seo?: ExtensionSeoMetadata | null;
	/** @description Unique URL - must start with can have multiple segments i.e. /about/company @required */
	permalink: string;
	/** @required */
	title: string;
	sections?: PagesSection[] | string[];
}

export interface PageSection {
	/** @primaryKey */
	id: number;
	status?: 'published' | 'draft' | 'archived';
	sort?: number | null;
	user_created?: string | null;
	date_created?: string | null;
	user_updated?: string | null;
	date_updated?: string | null;
	/** @required */
	title: string;
	full_width?: boolean | null;
	color?: string | null;
	/** @description Horizontal alignment of content @required */
	align_items: `flex-start` | 'center' | `flex-end`;
	/** @description Vertical alignmnt of content @required */
	justify_content: `flex-start` | 'center' | `flex-end` | `space-around` | `space-between` | `space-evenly` | 'stretch';
	/** @required */
	background_color: string;
	/** @required */
	background_size: 'cover' | 'contain';
	blocks?: PageSectionsBlock[] | string[];
}

export interface PageSectionsBlock {
	/** @primaryKey */
	id: number;
	page_sections_id?: PageSection | string | null;
	item?: BlockSlider | string | null;
	collection?: string | null;
}

export interface PagesSection {
	/** @primaryKey */
	id: number;
	Pages_id?: Page | string | null;
	item?: PageSection | string | null;
	collection?: string | null;
	sort?: number | null;
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

export interface DirectusFile {
	/** @primaryKey */
	id: string;
	storage?: string;
	filename_disk?: string | null;
	filename_download?: string;
	title?: string | null;
	type?: string | null;
	folder?: string | null;
	uploaded_by?: string | null;
	created_on?: string;
	modified_by?: string | null;
	modified_on?: string;
	charset?: string | null;
	filesize?: number | null;
	width?: number | null;
	height?: number | null;
	duration?: number | null;
	embed?: string | null;
	description?: string | null;
	location?: string | null;
	tags?: string[] | null;
	metadata?: 'json' | null;
	focal_point_x?: number | null;
	focal_point_y?: number | null;
	tus_id?: string | null;
	tus_data?: 'json' | null;
	uploaded_on?: string | null;
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
	block_slider: BlockSlider[];
	block_slider_slides: BlockSliderSlide[];
	globals: Globals;
	Pages: Page[];
	page_sections: PageSection[];
	page_sections_blocks: PageSectionsBlock[];
	Pages_sections: PagesSection[];
	directus_collections: DirectusCollection[];
	directus_fields: DirectusField[];
	directus_files: DirectusFile[];
	directus_relations: DirectusRelation[];
	directus_translations: DirectusTranslation[];
}

export enum CollectionNames {
	block_slider = 'block_slider',
	block_slider_slides = 'block_slider_slides',
	globals = 'globals',
	Pages = 'Pages',
	page_sections = 'page_sections',
	page_sections_blocks = 'page_sections_blocks',
	Pages_sections = 'Pages_sections',
	directus_collections = 'directus_collections',
	directus_fields = 'directus_fields',
	directus_files = 'directus_files',
	directus_relations = 'directus_relations',
	directus_translations = 'directus_translations'
}