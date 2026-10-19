import { expect } from "@std/expect";
import {
	hasErrors,
	normalizeQuoteDraft,
	parseQuoteDraft,
	validateQuoteDraft,
} from "@/domain/quote_validation.ts";
import { QUOTE_LIMITS } from "@/domain/quote.ts";

Deno.test("normalizeQuoteDraft trims author and text", () => {
	const result = normalizeQuoteDraft({
		author: "  Ada Lovelace  ",
		text: "  The Analytical Engine  ",
	});
	expect(result).toEqual({
		author: "Ada Lovelace",
		text: "The Analytical Engine",
	});
});

Deno.test("validateQuoteDraft accepts valid draft", () => {
	const errors = validateQuoteDraft({
		author: "Ada Lovelace",
		text: "The Analytical Engine weaves algebraic patterns.",
	});
	expect(errors).toEqual({});
	expect(hasErrors(errors)).toBe(false);
});

Deno.test("validateQuoteDraft rejects empty author", () => {
	const errors = validateQuoteDraft({ author: "   ", text: "Some text" });
	expect(errors.author).toBe("Author is required");
	expect(hasErrors(errors)).toBe(true);
});

Deno.test("validateQuoteDraft rejects empty text", () => {
	const errors = validateQuoteDraft({ author: "Author", text: "" });
	expect(errors.text).toBe("Quote text is required");
});

Deno.test("validateQuoteDraft rejects author longer than limit", () => {
	const errors = validateQuoteDraft({
		author: "a".repeat(QUOTE_LIMITS.authorMaxLength + 1),
		text: "ok",
	});
	expect(errors.author).toBe(
		`Author must be at most ${QUOTE_LIMITS.authorMaxLength} characters`,
	);
});

Deno.test("validateQuoteDraft rejects text longer than limit", () => {
	const errors = validateQuoteDraft({
		author: "ok",
		text: "t".repeat(QUOTE_LIMITS.textMaxLength + 1),
	});
	expect(errors.text).toBe(
		`Quote text must be at most ${QUOTE_LIMITS.textMaxLength} characters`,
	);
});

Deno.test("validateQuoteDraft accepts author and text at exact max length", () => {
	const errors = validateQuoteDraft({
		author: "a".repeat(QUOTE_LIMITS.authorMaxLength),
		text: "t".repeat(QUOTE_LIMITS.textMaxLength),
	});
	expect(errors).toEqual({});
});

Deno.test("parseQuoteDraft returns undefined for non-objects", () => {
	expect(parseQuoteDraft(null)).toBeUndefined();
	expect(parseQuoteDraft(undefined)).toBeUndefined();
	expect(parseQuoteDraft("string")).toBeUndefined();
	expect(parseQuoteDraft(42)).toBeUndefined();
	expect(parseQuoteDraft([])).toBeUndefined();
});

Deno.test("parseQuoteDraft returns undefined when fields are missing or wrong type", () => {
	expect(parseQuoteDraft({})).toBeUndefined();
	expect(parseQuoteDraft({ author: 1, text: "x" })).toBeUndefined();
	expect(parseQuoteDraft({ author: "x", text: true })).toBeUndefined();
});

Deno.test("parseQuoteDraft normalizes a valid object", () => {
	const result = parseQuoteDraft({
		author: "  Jane  ",
		text: "  Hello  ",
		extra: "ignored",
	});
	expect(result).toEqual({ author: "Jane", text: "Hello" });
});
