import { Head } from "fresh/runtime";
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
import { SearchForm } from "@/components/SearchForm.tsx";
import { Pagination } from "@/components/Pagination.tsx";
import { QuoteCard } from "@/components/QuoteCard.tsx";
import CreateQuoteButton from "@/islands/CreateQuoteButton.tsx";
import NoticeToast from "@/islands/NoticeToast.tsx";

export default define.page(async function Home(ctx) {
	const query = parseListQuery(ctx.url.searchParams);
	const notice = parseNoticeCode(ctx.url.searchParams.get("notice"));

	let page = query.page;
	const criteria = {
		page: page === LAST_PAGE ? FIRST_PAGE : page,
		size: DEFAULT_PAGE_SIZE,
		author: query.author,
	};

	let total = 0;
	let items: { id: number; author: string; text: string }[] = [];

	try {
		const result = await getQuotesApi().list(criteria);
		total = result.total;
		items = result.items;

		if (page === LAST_PAGE) {
			const totalPages = calculateTotalPages(total, DEFAULT_PAGE_SIZE);
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
		} else if (page > 1) {
			const totalPages = calculateTotalPages(total, DEFAULT_PAGE_SIZE);
			if (page > totalPages && totalPages >= FIRST_PAGE) {
				return ctx.redirect(
					buildListHref(
						{ page: totalPages, author: query.author },
						notice,
					),
					303,
				);
			}
		}
	} catch (error) {
		console.error("Failed to load quotes", error);
	}

	return (
		<>
			<Head>
				<title>Quote Share</title>
			</Head>
			<div class="page">
				<header class="page__header">
					<div class="page__header-inner">
						<h1 class="page__title">Quote Share</h1>
						<CreateQuoteButton />
					</div>
					<SearchForm author={query.author} />
				</header>

				<main class="page__main">
					{items.length === 0
						? (
							<p class="empty-state">
								{query.author
									? `No quotes found for “${query.author}”.`
									: "No quotes yet. Create the first one!"}
							</p>
						)
						: (
							<ul class="quote-list">
								{items.map((quote) => (
									<li key={quote.id}>
										<QuoteCard quote={quote} />
									</li>
								))}
							</ul>
						)}

					<Pagination
						query={{ ...query, page }}
						total={total}
						pageSize={DEFAULT_PAGE_SIZE}
					/>
				</main>

				{notice && <NoticeToast code={notice} />}
			</div>
		</>
	);
});
