import { NOTICE_QUERY_PARAM, type NoticeCode } from "./notice.ts";
import { FIRST_PAGE, LAST_PAGE, parsePageNumber } from "./pagination.ts";

const PAGE_PARAM = "page";
const AUTHOR_PARAM = "author";
const LAST_PAGE_TOKEN = "last";

export const NEW_QUOTE_PAGE: number = LAST_PAGE;

export interface ListQuery {
	page: number;
	author: string;
}

export function parseListQuery(params: URLSearchParams): ListQuery {
	const rawPage = params.get(PAGE_PARAM);
	return {
		page: rawPage === LAST_PAGE_TOKEN
			? LAST_PAGE
			: parsePageNumber(rawPage),
		author: (params.get(AUTHOR_PARAM) ?? "").trim(),
	};
}

export function buildListHref(
	{ page, author }: ListQuery,
	notice?: NoticeCode,
): string {
	const params = new URLSearchParams();
	if (page === LAST_PAGE) params.set(PAGE_PARAM, LAST_PAGE_TOKEN);
	else if (page > FIRST_PAGE) params.set(PAGE_PARAM, String(page));
	if (author) params.set(AUTHOR_PARAM, author);
	if (notice) params.set(NOTICE_QUERY_PARAM, notice);
	const query = params.toString();
	return query ? `/?${query}` : "/";
}
