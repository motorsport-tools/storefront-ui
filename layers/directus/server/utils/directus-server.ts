import type { Schema } from './../../shared/types/schema'
import {
	createDirectus,
	readItems,
	rest,
	staticToken,
	withToken,
	type QueryFilter,
} from '@directus/sdk';

const {
	public: { directusUrl },
	directusServerToken,
} = useRuntimeConfig();

const directusServer = createDirectus<Schema>(directusUrl as string).with(rest())
.with(staticToken(directusServerToken as string))

export {
	directusServer,
	readItems,
	withToken,
};
export type { QueryFilter };