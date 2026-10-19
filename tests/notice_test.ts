import { expect } from "@std/expect";
import { NOTICES, parseNoticeCode } from "@/domain/notice.ts";

Deno.test("parseNoticeCode accepts known codes", () => {
	expect(parseNoticeCode("created")).toBe("created");
	expect(parseNoticeCode("updated")).toBe("updated");
	expect(parseNoticeCode("deleted")).toBe("deleted");
});

Deno.test("parseNoticeCode rejects unknown or missing values", () => {
	expect(parseNoticeCode(null)).toBeUndefined();
	expect(parseNoticeCode("")).toBeUndefined();
	expect(parseNoticeCode("success")).toBeUndefined();
	expect(parseNoticeCode("CREATED")).toBeUndefined();
});

Deno.test("NOTICES contains human-readable messages for every code", () => {
	for (const code of Object.keys(NOTICES) as (keyof typeof NOTICES)[]) {
		expect(typeof NOTICES[code]).toBe("string");
		expect(NOTICES[code].length).toBeGreaterThan(0);
	}
});
