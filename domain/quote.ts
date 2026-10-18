export const QUOTE_LIMITS = {
	authorMaxLength: 200,
	textMaxLength: 1000,
} as const;

export interface QuoteDraft {
	author: string;
	text: string;
}

export interface Quote extends QuoteDraft {
	id: number;
}

export interface QuotePage {
	items: Quote[];
	total: number;
}

export interface QuoteSearchCriteria {
	page: number;
	size: number;
	author: string;
}

export const EMPTY_QUOTE_DRAFT: Readonly<QuoteDraft> = { author: "", text: "" };
