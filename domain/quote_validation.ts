import { QUOTE_LIMITS, type QuoteDraft } from "./quote.ts";

export type QuoteDraftErrors = Partial<Record<keyof QuoteDraft, string>>;

export function normalizeQuoteDraft(draft: QuoteDraft): QuoteDraft {
	return { author: draft.author.trim(), text: draft.text.trim() };
}

export function validateQuoteDraft(draft: QuoteDraft): QuoteDraftErrors {
	const errors: QuoteDraftErrors = {};
	const authorError = validateField(
		draft.author,
		"Author",
		QUOTE_LIMITS.authorMaxLength,
	);
	const textError = validateField(
		draft.text,
		"Quote text",
		QUOTE_LIMITS.textMaxLength,
	);
	if (authorError) errors.author = authorError;
	if (textError) errors.text = textError;
	return errors;
}

export function hasErrors(errors: QuoteDraftErrors): boolean {
	return Object.keys(errors).length > 0;
}

export function parseQuoteDraft(value: unknown): QuoteDraft | undefined {
	if (typeof value !== "object" || value === null) return undefined;
	const { author, text } = value as Record<string, unknown>;
	if (typeof author !== "string" || typeof text !== "string") {
		return undefined;
	}
	return normalizeQuoteDraft({ author, text });
}

function validateField(
	value: string,
	label: string,
	maxLength: number,
): string | undefined {
	if (value.trim().length === 0) return `${label} is required`;
	if (value.length > maxLength) {
		return `${label} must be at most ${maxLength} characters`;
	}
	return undefined;
}
