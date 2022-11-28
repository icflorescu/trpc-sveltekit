import { version } from '../../../package/package.json';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = () => ({ version });
