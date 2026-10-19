import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { handler } from "./index.handlers.ts";
import { DEFAULT_PAGE_SIZE } from "@/domain/pagination.ts";
import { SearchForm } from "@/components/SearchForm.tsx";
import { Pagination } from "@/components/Pagination.tsx";
import { QuoteCard } from "@/components/QuoteCard.tsx";
import CreateQuoteButton from "@/islands/CreateQuoteButton.tsx";
import NoticeToast from "@/islands/NoticeToast.tsx";

export { handler } from "./index.handlers.ts";

export default define.page<typeof handler>(function Home({ data }) {
	const { query, notice, page, total, items } = data;

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
