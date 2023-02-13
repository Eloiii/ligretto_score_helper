import {error} from '@sveltejs/kit';
import type {PageServerLoad} from './$types';
import {getGame} from "$lib/firebase";

export const ssr = false;
export const prerender = false;
export const load = (async ({params}) => {
    const post = await getGame(params.slug);

    if (post) {
        return {slug: params.slug, data: post};
    }

    throw error(404, 'Not found');
}) satisfies PageServerLoad;