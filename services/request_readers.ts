import { STATUS_CODE } from "@std/http/status";
import type { QuoteDraft } from "@/domain/quote.ts";
import {
	hasErrors,
	parseQuoteDraft,
	validateQuoteDraft,
} from "@/domain/quote_validation.ts";
import { RequestError } from "./api_errors.ts";

const QUOTE_ID_PATTERN = /^\d+$/;
const MAX_QUOTE_ID = 2 ** 31 - 1;

export async function readQuoteDraft(request: Request): Promise<QuoteDraft> {
	const payload: unknown = await request.json().catch(() => undefined);
	const draft = parseQuoteDraft(payload);
	if (!draft) {
		throw new RequestError(
			STATUS_CODE.BadRequest,
			'Request body must be a JSON object with string fields "author" and "text"',
		);
	}
	const errors = validateQuoteDraft(draft);
	if (hasErrors(errors)) {
		throw new RequestError(
			STATUS_CODE.UnprocessableEntity,
			"The quote is invalid",
			errors,
		);
	}
	return draft;
}

export function readQuoteId(params: Record<string, string>): number {
	const rawId = params.id ?? "";
	const id = Number(rawId);
	if (!QUOTE_ID_PATTERN.test(rawId) || id > MAX_QUOTE_ID) {
		throw new RequestError(
			STATUS_CODE.BadRequest,
			"Quote id must be a non-negative 32-bit integer",
		);
	}
	return id;
}
