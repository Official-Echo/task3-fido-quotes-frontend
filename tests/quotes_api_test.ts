import { expect } from "@std/expect";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { BackendError, createQuotesApi } from "@/services/quotes_api.ts";

const BACKEND = new URL("http://backend.test/");

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function emptyResponse(status: number): Response {
	return new Response(null, { status });
}

function argsOf(spyFn: { calls: { args: unknown[] }[] }, index: number) {
	return spyFn.calls[index].args as [URL | Request | string, RequestInit?];
}

Deno.test("list maps 1-based app page to 0-based backend page", async () => {
	const fetchSpy = spy((_url: URL | Request | string, _init?: RequestInit) =>
		Promise.resolve(jsonResponse({ total: 0, items: [] }))
	);
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);

	await api.list({ page: 1, size: 6, author: "" });
	await api.list({ page: 3, size: 10, author: "Ada" });

	assertSpyCalls(fetchSpy, 2);
	const firstUrl = new URL(String(argsOf(fetchSpy, 0)[0]));
	expect(firstUrl.searchParams.get("page")).toBe("0");
	expect(firstUrl.searchParams.get("size")).toBe("6");
	expect(firstUrl.searchParams.has("author")).toBe(false);

	const secondUrl = new URL(String(argsOf(fetchSpy, 1)[0]));
	expect(secondUrl.searchParams.get("page")).toBe("2");
	expect(secondUrl.searchParams.get("size")).toBe("10");
	expect(secondUrl.searchParams.get("author")).toBe("Ada");
});

Deno.test("list returns parsed QuotePage", async () => {
	const fetchSpy = spy(() =>
		Promise.resolve(jsonResponse({
			total: 1,
			items: [{ id: 7, author: "Ada", text: "Hello" }],
		}))
	);
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	const page = await api.list({ page: 1, size: 6, author: "" });
	expect(page).toEqual({
		total: 1,
		items: [{ id: 7, author: "Ada", text: "Hello" }],
	});
});

Deno.test("list throws BackendError on non-OK response", async () => {
	const fetchSpy = spy(() => Promise.resolve(emptyResponse(500)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await expect(api.list({ page: 1, size: 6, author: "" })).rejects
		.toBeInstanceOf(BackendError);
});

Deno.test("list throws BackendError when payload is malformed", async () => {
	const fetchSpy = spy(() => Promise.resolve(jsonResponse({ bad: true })));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await expect(api.list({ page: 1, size: 6, author: "" })).rejects
		.toMatchObject({ status: 502 });
});

Deno.test("create returns the numeric id from 201 body", async () => {
	const fetchSpy = spy(() => Promise.resolve(jsonResponse(42, 201)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	const id = await api.create({ author: "Ada", text: "Hi" });
	expect(id).toBe(42);

	const [url, init] = argsOf(fetchSpy, 0);
	expect(String(url)).toBe("http://backend.test/quotes");
	expect(init?.method).toBe("POST");
	expect(JSON.parse(init?.body as string)).toEqual({
		author: "Ada",
		text: "Hi",
	});
});

Deno.test("create throws when body is not a number", async () => {
	const fetchSpy = spy(() => Promise.resolve(jsonResponse({ id: 1 }, 201)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await expect(api.create({ author: "A", text: "B" })).rejects.toMatchObject({
		status: 502,
	});
});

Deno.test("update sends PUT and ignores body on success", async () => {
	const fetchSpy = spy(() => Promise.resolve(emptyResponse(204)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await api.update(9, { author: "A", text: "B" });

	const [url, init] = argsOf(fetchSpy, 0);
	expect(String(url)).toBe("http://backend.test/quotes/9");
	expect(init?.method).toBe("PUT");
});

Deno.test("remove sends DELETE", async () => {
	const fetchSpy = spy(() => Promise.resolve(emptyResponse(204)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await api.remove(11);

	const [url, init] = argsOf(fetchSpy, 0);
	expect(String(url)).toBe("http://backend.test/quotes/11");
	expect(init?.method).toBe("DELETE");
});

Deno.test("network failure becomes BackendError 502", async () => {
	const fetchSpy = spy(() => Promise.reject(new TypeError("network down")));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await expect(api.list({ page: 1, size: 6, author: "" })).rejects
		.toMatchObject({
			status: 502,
			message: "The quote service is unreachable",
		});
});

Deno.test("404 from backend maps to friendly message", async () => {
	const fetchSpy = spy(() => Promise.resolve(emptyResponse(404)));
	const api = createQuotesApi(BACKEND, fetchSpy as unknown as typeof fetch);
	await expect(api.remove(99)).rejects.toMatchObject({
		status: 404,
		message: "The quote no longer exists",
	});
});
