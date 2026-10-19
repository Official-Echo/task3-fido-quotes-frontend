import { page as renderPage } from "fresh";
import { define } from "@/utils.ts";
import { getQuotesApi } from "@/services/container.ts";
import {
	calculateTotalPages,
	DEFAULT_PAGE_SIZE,
	FIRST_PAGE,
	LAST_PAGE,
} from "@/domain/pagination.ts";
import { buildListHref, parseListQuery } from "@/domain/list_query.ts";
import { parseNoticeCode } from "@/domain/notice.ts";

export const handler = define.handlers({
	GET: async (ctx) => {
		const query = parseListQuery(ctx.url.searchParams);
		const notice = parseNoticeCode(
			ctx.url.searchParams.get("notice"),
		);

		let page = query.page;

		try {
			const result = await getQuotesApi().list({
				page: page === LAST_PAGE ? FIRST_PAGE : page,
				size: DEFAULT_PAGE_SIZE,
				author: query.author,
			});

			const totalPages = calculateTotalPages(
				result.total,
				DEFAULT_PAGE_SIZE,
			);

			if (page === LAST_PAGE) {
				const lastPage = Math.max(FIRST_PAGE, totalPages);

				if (lastPage !== FIRST_PAGE) {
					return ctx.redirect(
						buildListHref(
							{ page: lastPage, author: query.author },
							notice,
						),
						303,
					);
				}

				page = lastPage;
			} else if (
				page > FIRST_PAGE &&
				page > totalPages &&
				totalPages >= FIRST_PAGE
			) {
				return ctx.redirect(
					buildListHref(
						{ page: totalPages, author: query.author },
						notice,
					),
					303,
				);
			}

			return renderPage({
				query,
				notice,
				page,
				total: result.total,
				items: result.items,
			});
		} catch (error) {
			console.error("Failed to load quotes", error);

			return renderPage({
				query,
				notice,
				page,
				total: 0,
				items: [],
			});
		}
	},
});
