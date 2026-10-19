import { useSignal } from "@preact/signals";
import type { Quote, QuoteDraft } from "@/domain/quote.ts";
import { deleteQuote, updateQuote } from "@/client/quotes_client.ts";
import {
	readCurrentListQuery,
	showListWithNotice,
} from "@/client/navigation.ts";
import { QuoteFormDialog } from "@/components/QuoteFormDialog.tsx";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog.tsx";

interface QuoteActionsProps {
	quote: Quote;
}

export function QuoteActions({ quote }: QuoteActionsProps) {
	const editing = useSignal(false);
	const deleting = useSignal(false);

	async function handleUpdate(draft: QuoteDraft) {
		await updateQuote(quote.id, draft);
		showListWithNotice(readCurrentListQuery(), "updated");
	}

	async function handleDelete() {
		await deleteQuote(quote.id);
		showListWithNotice(readCurrentListQuery(), "deleted");
	}

	return (
		<div class="quote-actions">
			<button
				type="button"
				class="button button--small"
				onClick={() => (editing.value = true)}
			>
				Edit
			</button>
			<button
				type="button"
				class="button button--small button--danger"
				onClick={() => (deleting.value = true)}
			>
				Delete
			</button>
			{editing.value && (
				<QuoteFormDialog
					title="Edit quote"
					submitLabel="Save"
					initialDraft={{ author: quote.author, text: quote.text }}
					onSubmit={handleUpdate}
					onClose={() => (editing.value = false)}
				/>
			)}
			{deleting.value && (
				<ConfirmDeleteDialog
					quote={quote}
					onConfirm={handleDelete}
					onClose={() => (deleting.value = false)}
				/>
			)}
		</div>
	);
}
