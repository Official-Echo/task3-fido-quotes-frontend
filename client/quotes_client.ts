import type { QuoteDraft } from "@/domain/quote.ts";

const QUOTES_ENDPOINT = "/api/quotes";
const JSON_HEADERS = { "Content-Type": "application/json" };
const NETWORK_ERROR_MESSAGE =
	"Network error. Check your connection and try again.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

interface ErrorBody {
	message?: unknown;
}

export class QuotesClientError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "QuotesClientError";
	}
}

export function createQuote(draft: QuoteDraft): Promise<void> {
	return request(QUOTES_ENDPOINT, "POST", draft);
}

export function updateQuote(id: number, draft: QuoteDraft): Promise<void> {
	return request(`${QUOTES_ENDPOINT}/${id}`, "PUT", draft);
}

export function deleteQuote(id: number): Promise<void> {
	return request(`${QUOTES_ENDPOINT}/${id}`, "DELETE");
}

async function request(
	url: string,
	method: string,
	body?: QuoteDraft,
): Promise<void> {
	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers: body ? JSON_HEADERS : undefined,
			body: body ? JSON.stringify(body) : undefined,
		});
	} catch {
		throw new QuotesClientError(NETWORK_ERROR_MESSAGE);
	}
	if (!response.ok) {
		throw new QuotesClientError(await readErrorMessage(response));
	}
}

async function readErrorMessage(response: Response): Promise<string> {
	const body: ErrorBody = await response.json().catch(() => ({}));
	return typeof body.message === "string"
		? body.message
		: GENERIC_ERROR_MESSAGE;
}
