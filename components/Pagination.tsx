import {
	buildPageWindow,
	calculateTotalPages,
	FIRST_PAGE,
} from "@/domain/pagination.ts";
import { buildListHref, type ListQuery } from "@/domain/list_query.ts";

interface PaginationProps {
	query: ListQuery;
	total: number;
	pageSize: number;
}

export function Pagination({ query, total, pageSize }: PaginationProps) {
	const totalPages = calculateTotalPages(total, pageSize);
	if (totalPages <= 1) return null;

	const current = query.page === Number.POSITIVE_INFINITY
		? totalPages
		: Math.min(query.page, totalPages);
	const pages = buildPageWindow(current, totalPages);

	return (
		<nav class="pagination" aria-label="Pagination">
			<PaginationLink
				query={query}
				page={current - 1}
				disabled={current <= FIRST_PAGE}
				label="Previous"
			/>
			<ol class="pagination__list">
				{pages.map((page) => (
					<li key={page}>
						<PaginationLink
							query={query}
							page={page}
							current={page === current}
							label={String(page)}
						/>
					</li>
				))}
			</ol>
			<PaginationLink
				query={query}
				page={current + 1}
				disabled={current >= totalPages}
				label="Next"
			/>
		</nav>
	);
}

interface PaginationLinkProps {
	query: ListQuery;
	page: number;
	label: string;
	disabled?: boolean;
	current?: boolean;
}

function PaginationLink(
	{ query, page, label, disabled = false, current = false }:
		PaginationLinkProps,
) {
	if (disabled || current) {
		return (
			<span
				class={`pagination__item${
					current ? " pagination__item--current" : ""
				}`}
				aria-current={current ? "page" : undefined}
				aria-disabled={disabled ? "true" : undefined}
			>
				{label}
			</span>
		);
	}
	return (
		<a
			class="pagination__item"
			href={buildListHref({ ...query, page })}
		>
			{label}
		</a>
	);
}
