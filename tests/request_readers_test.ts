import { expect } from "@std/expect";
import { STATUS_CODE } from "@std/http/status";
import { readQuoteDraft, readQuoteId } from "@/services/request_readers.ts";
import { RequestError } from "@/services/api_errors.ts";

function jsonRequest(body: unknown): Request {
	return new Request("http://localhost/api/quotes", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

Deno.test("readQuoteDraft accepts a valid body", async () => {
	const draft = await readQuoteDraft(
		jsonRequest({ author: "  Ada  ", text: "  Hello  " }),
	);
	expect(draft).toEqual({ author: "Ada", text: "Hello" });
});

Deno.test("readQuoteDraft rejects missing fields", async () => {
	await expect(readQuoteDraft(jsonRequest({}))).rejects.toMatchObject({
		status: STATUS_CODE.BadRequest,
	});
});

Deno.test("readQuoteDraft rejects invalid types", async () => {
	await expect(
		readQuoteDraft(jsonRequest({ author: 1, text: "x" })),
	).rejects.toBeInstanceOf(RequestError);
});

Deno.test("readQuoteDraft rejects empty values after trim", async () => {
	await expect(
		readQuoteDraft(jsonRequest({ author: "   ", text: "ok" })),
	).rejects.toMatchObject({
		status: STATUS_CODE.UnprocessableEntity,
		fieldErrors: { author: "Author is required" },
	});
});

Deno.test("readQuoteDraft rejects over-long fields", async () => {
	await expect(
		readQuoteDraft(
			jsonRequest({ author: "a".repeat(201), text: "ok" }),
		),
	).rejects.toMatchObject({
		status: STATUS_CODE.UnprocessableEntity,
	});
});

Deno.test("readQuoteId accepts valid numeric ids", () => {
	expect(readQuoteId({ id: "0" })).toBe(0);
	expect(readQuoteId({ id: "42" })).toBe(42);
	expect(readQuoteId({ id: String(2 ** 31 - 1) })).toBe(2 ** 31 - 1);
});

Deno.test("readQuoteId rejects non-numeric and out-of-range ids", () => {
	expect(() => readQuoteId({ id: "" })).toThrow(RequestError);
	expect(() => readQuoteId({ id: "abc" })).toThrow(RequestError);
	expect(() => readQuoteId({ id: "-1" })).toThrow(RequestError);
	expect(() => readQuoteId({ id: "1.5" })).toThrow(RequestError);
	expect(() => readQuoteId({ id: String(2 ** 31) })).toThrow(RequestError);
	expect(() => readQuoteId({})).toThrow(RequestError);
});
