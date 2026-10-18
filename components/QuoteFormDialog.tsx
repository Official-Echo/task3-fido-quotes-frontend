import { useSignal } from "@preact/signals";
import { QUOTE_LIMITS, type QuoteDraft } from "@/domain/quote.ts";
import {
	hasErrors,
	normalizeQuoteDraft,
	validateQuoteDraft,
} from "@/domain/quote_validation.ts";
import { useSubmission } from "@/client/use_submission.ts";
import { FormField } from "./FormField.tsx";
import { ModalDialog } from "./ModalDialog.tsx";

type TouchedFields = Partial<Record<keyof QuoteDraft, boolean>>;

interface QuoteFormDialogProps {
	title: string;
	submitLabel: string;
	initialDraft: QuoteDraft;
	onSubmit: (draft: QuoteDraft) => Promise<void>;
	onClose: () => void;
}

export function QuoteFormDialog(
	{ title, submitLabel, initialDraft, onSubmit, onClose }:
		QuoteFormDialogProps,
) {
	const draft = useSignal<QuoteDraft>({ ...initialDraft });
	const touched = useSignal<TouchedFields>({});
	const submission = useSubmission();

	const errors = validateQuoteDraft(draft.value);
	const canSubmit = !hasErrors(errors) && !submission.isPending.value;

	function updateField(field: keyof QuoteDraft, value: string) {
		draft.value = { ...draft.value, [field]: value };
	}

	function markTouched(field: keyof QuoteDraft) {
		touched.value = { ...touched.value, [field]: true };
	}

	function visibleError(field: keyof QuoteDraft): string | undefined {
		const hasInteracted = touched.value[field] ||
			draft.value[field].length > 0;
		return hasInteracted ? errors[field] : undefined;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!canSubmit) return;
		await submission.run(() => onSubmit(normalizeQuoteDraft(draft.value)));
	}

	return (
		<ModalDialog title={title} onClose={onClose}>
			<form class="form" onSubmit={handleSubmit} noValidate>
				<FormField
					label="Author"
					value={draft.value.author}
					maxLength={QUOTE_LIMITS.authorMaxLength}
					error={visibleError("author")}
					onInput={(value) => updateField("author", value)}
					onBlur={() => markTouched("author")}
				/>
				<FormField
					label="Quote"
					multiline
					value={draft.value.text}
					maxLength={QUOTE_LIMITS.textMaxLength}
					error={visibleError("text")}
					onInput={(value) => updateField("text", value)}
					onBlur={() => markTouched("text")}
				/>
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
						type="submit"
						class="button button--primary"
						disabled={!canSubmit}
					>
						{submission.isPending.value ? "Saving…" : submitLabel}
					</button>
				</div>
			</form>
		</ModalDialog>
	);
}
