import { buildListHref } from "@/domain/list_query.ts";

interface SearchFormProps {
	author: string;
}

export function SearchForm({ author }: SearchFormProps) {
	return (
		<form class="search" method="get" action="/">
			<label class="search__label" for="author-search">
				Search by author
			</label>
			<div class="search__row">
				<input
					id="author-search"
					class="search__input"
					type="search"
					name="author"
					value={author}
					placeholder="Type an author name…"
					autocomplete="off"
				/>
				<button type="submit" class="button button--primary">
					Search
				</button>
				{author && (
					<a
						class="button"
						href={buildListHref({ page: 1, author: "" })}
					>
						Clear
					</a>
				)}
			</div>
		</form>
	);
}
