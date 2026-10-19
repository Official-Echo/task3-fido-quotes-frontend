import { expect } from "@std/expect";
import {
	buildPageWindow,
	calculateTotalPages,
	FIRST_PAGE,
	parsePageNumber,
} from "@/domain/pagination.ts";

Deno.test("calculateTotalPages returns at least 1", () => {
	expect(calculateTotalPages(0, 6)).toBe(1);
	expect(calculateTotalPages(1, 6)).toBe(1);
	expect(calculateTotalPages(6, 6)).toBe(1);
	expect(calculateTotalPages(7, 6)).toBe(2);
	expect(calculateTotalPages(18, 6)).toBe(3);
});

Deno.test("parsePageNumber falls back to FIRST_PAGE for invalid input", () => {
	expect(parsePageNumber(null)).toBe(FIRST_PAGE);
	expect(parsePageNumber("")).toBe(FIRST_PAGE);
	expect(parsePageNumber("abc")).toBe(FIRST_PAGE);
	expect(parsePageNumber("0")).toBe(FIRST_PAGE);
	expect(parsePageNumber("-3")).toBe(FIRST_PAGE);
	expect(parsePageNumber("1.5")).toBe(FIRST_PAGE);
});

Deno.test("parsePageNumber accepts valid page numbers", () => {
	expect(parsePageNumber("1")).toBe(1);
	expect(parsePageNumber("42")).toBe(42);
});

Deno.test("buildPageWindow centres the current page when possible", () => {
	expect(buildPageWindow(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
	expect(buildPageWindow(3, 10, 5)).toEqual([1, 2, 3, 4, 5]);
	expect(buildPageWindow(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
	expect(buildPageWindow(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
	expect(buildPageWindow(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
});

Deno.test("buildPageWindow shrinks when totalPages is smaller than window", () => {
	expect(buildPageWindow(1, 3, 5)).toEqual([1, 2, 3]);
	expect(buildPageWindow(2, 3, 5)).toEqual([1, 2, 3]);
	expect(buildPageWindow(1, 1, 5)).toEqual([1]);
});
