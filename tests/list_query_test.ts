import { expect } from "@std/expect";
import { buildListHref, parseListQuery } from "@/domain/list_query.ts";
import { LAST_PAGE } from "@/domain/pagination.ts";

Deno.test("parseListQuery defaults to page 1 and empty author", () => {
	expect(parseListQuery(new URLSearchParams())).toEqual({
		page: 1,
		author: "",
	});
});

Deno.test("parseListQuery reads page and author", () => {
	const params = new URLSearchParams("page=3&author=Ada");
	expect(parseListQuery(params)).toEqual({ page: 3, author: "Ada" });
});

Deno.test("parseListQuery trims author and treats page=last as LAST_PAGE", () => {
	const params = new URLSearchParams("page=last&author=%20%20Jane%20%20");
	expect(parseListQuery(params)).toEqual({
		page: LAST_PAGE,
		author: "Jane",
	});
});

Deno.test("parseListQuery falls back for invalid page", () => {
	expect(parseListQuery(new URLSearchParams("page=0")).page).toBe(1);
	expect(parseListQuery(new URLSearchParams("page=abc")).page).toBe(1);
});

Deno.test("buildListHref omits default page and empty author", () => {
	expect(buildListHref({ page: 1, author: "" })).toBe("/");
});

Deno.test("buildListHref includes page, author and notice", () => {
	expect(buildListHref({ page: 2, author: "Ada" }, "created")).toBe(
		"/?page=2&author=Ada&notice=created",
	);
});

Deno.test("buildListHref encodes the last-page token", () => {
	expect(buildListHref({ page: LAST_PAGE, author: "" })).toBe("/?page=last");
	expect(buildListHref({ page: LAST_PAGE, author: "X" }, "deleted")).toBe(
		"/?page=last&author=X&notice=deleted",
	);
});
