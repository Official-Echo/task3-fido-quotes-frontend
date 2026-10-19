import { useSignal } from "@preact/signals";
import { EMPTY_QUOTE_DRAFT, type QuoteDraft } from "@/domain/quote.ts";
import { createQuote } from "@/client/quotes_client.ts";
import {
	readCurrentListQuery,
	showListWithNotice,
} from "@/client/navigation.ts";
import { NEW_QUOTE_PAGE } from "@/domain/list_query.ts";
import { QuoteFormDialog } from "@/components/QuoteFormDialog.tsx";

export default function CreateQuoteButton() {
	const open = useSignal(false);

	async function handleSubmit(draft: QuoteDraft) {
		await createQuote(draft);
		const query = readCurrentListQuery();
		showListWithNotice(
			{ ...query, page: NEW_QUOTE_PAGE },
			"created",
		);
	}

	return (
		<>
			<button
				type="button"
				class="button button--primary"
				onClick={() => (open.value = true)}
			>
				Add quote
			</button>
			{open.value && (
				<QuoteFormDialog
					title="New quote"
					submitLabel="Create"
					initialDraft={EMPTY_QUOTE_DRAFT}
					onSubmit={handleSubmit}
					onClose={() => (open.value = false)}
				/>
			)}
		</>
	);
}
