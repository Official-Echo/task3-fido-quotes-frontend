import { STATUS_CODE } from "@std/http/status";
import type {
	Quote,
	QuoteDraft,
	QuotePage,
	QuoteSearchCriteria,
} from "@/domain/quote.ts";
import { FIRST_PAGE } from "@/domain/pagination.ts";

const QUOTES_PATH = "quotes";
const JSON_HEADERS = { "Content-Type": "application/json" };

export class BackendError extends Error {
	constructor(
		readonly status: number,
		message: string,
		options?: ErrorOptions,
	) {
		super(message, options);
		this.name = "BackendError";
	}
}

export interface QuotesApi {
	list(criteria: QuoteSearchCriteria): Promise<QuotePage>;
	create(draft: QuoteDraft): Promise<number>;
	update(id: number, draft: QuoteDraft): Promise<void>;
	remove(id: number): Promise<void>;
}

export function createQuotesApi(
	backendUrl: URL,
	fetchFn: typeof fetch = fetch,
): QuotesApi {
	const collectionUrl = () => new URL(QUOTES_PATH, backendUrl);
	const itemUrl = (id: number) => new URL(`${QUOTES_PATH}/${id}`, backendUrl);

	async function send(
		url: URL,
		method: string,
		body?: QuoteDraft,
	): Promise<Response> {
		const init: RequestInit = { method };
		if (body) {
			init.headers = JSON_HEADERS;
			init.body = JSON.stringify(body);
		}
		let response: Response;
		try {
			response = await fetchFn(url, init);
		} catch (cause) {
			throw new BackendError(
				STATUS_CODE.BadGateway,
				"The quote service is unreachable",
				{ cause },
			);
		}
		if (!response.ok) {
			await response.body?.cancel();
			throw new BackendError(
				response.status,
				describeFailure(response.status),
			);
		}
		return response;
	}

	return {
		async list({ page, size, author }) {
			const url = collectionUrl();
			url.searchParams.set(
				"page",
				String(page - FIRST_PAGE),
			);
			url.searchParams.set("size", String(size));
			if (author) url.searchParams.set("author", author);
			const response = await send(url, "GET");
			return parseQuotePage(await response.json());
		},

		async create(draft) {
			const response = await send(collectionUrl(), "POST", draft);
			const id: unknown = await response.json();
			if (typeof id !== "number") throw unexpectedResponse();
			return id;
		},

		async update(id, draft) {
			const response = await send(itemUrl(id), "PUT", draft);
			await response.body?.cancel();
		},

		async remove(id) {
			const response = await send(itemUrl(id), "DELETE");
			await response.body?.cancel();
		},
	};
}

function describeFailure(status: number): string {
	return status === STATUS_CODE.NotFound
		? "The quote no longer exists"
		: `The quote service responded with status ${status}`;
}

function unexpectedResponse(): BackendError {
	return new BackendError(
		STATUS_CODE.BadGateway,
		"The quote service returned an unexpected response",
	);
}

function parseQuotePage(payload: unknown): QuotePage {
	if (!isQuotePage(payload)) throw unexpectedResponse();
	return payload;
}

function isQuotePage(payload: unknown): payload is QuotePage {
	if (typeof payload !== "object" || payload === null) return false;
	const { total, items } = payload as Record<string, unknown>;
	return typeof total === "number" && Array.isArray(items) &&
		items.every(isQuote);
}

function isQuote(value: unknown): value is Quote {
	if (typeof value !== "object" || value === null) return false;
	const { id, author, text } = value as Record<string, unknown>;
	return typeof id === "number" && typeof author === "string" &&
		typeof text === "string";
}
