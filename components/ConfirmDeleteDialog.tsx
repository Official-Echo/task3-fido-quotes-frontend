import type { Quote } from "@/domain/quote.ts";
import { useSubmission } from "@/client/use_submission.ts";
import { ModalDialog } from "./ModalDialog.tsx";

interface ConfirmDeleteDialogProps {
	quote: Quote;
	onConfirm: () => Promise<void>;
	onClose: () => void;
}

export function ConfirmDeleteDialog(
	{ quote, onConfirm, onClose }: ConfirmDeleteDialogProps,
) {
	const submission = useSubmission();

	return (
		<ModalDialog title="Delete quote?" onClose={onClose}>
			<div class="form">
				<p class="dialog__message">
					This will permanently delete the quote by{" "}
					<strong>{quote.author}</strong> and cannot be undone.
				</p>
				{submission.errorMessage.value && (
					<p class="form__error" role="alert">
						{submission.errorMessage.value}
					</p>
				)}
				<div class="form__actions">
					<button type="button" class="button" onClick={onClose}>
						Cancel
					</button>
					<button
						type="button"
						class="button button--danger"
						disabled={submission.isPending.value}
						onClick={() => submission.run(onConfirm)}
					>
						{submission.isPending.value ? "Deleting…" : "Delete"}
					</button>
				</div>
			</div>
		</ModalDialog>
	);
}
