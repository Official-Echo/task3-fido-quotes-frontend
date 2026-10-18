export const DEFAULT_PAGE_SIZE = 6;
export const PAGE_WINDOW_SIZE = 5;
export const FIRST_PAGE = 1;
export const LAST_PAGE = Number.POSITIVE_INFINITY;

export function calculateTotalPages(total: number, pageSize: number): number {
	return Math.max(FIRST_PAGE, Math.ceil(total / pageSize));
}

export function parsePageNumber(raw: string | null): number {
	const parsed = Number.parseInt(raw ?? "", 10);
	return Number.isInteger(parsed) && parsed >= FIRST_PAGE
		? parsed
		: FIRST_PAGE;
}

export function buildPageWindow(
	currentPage: number,
	totalPages: number,
	windowSize = PAGE_WINDOW_SIZE,
): number[] {
	const visibleCount = Math.min(windowSize, totalPages);
	const pagesBeforeCurrent = Math.floor(visibleCount / 2);
	const lastPossibleStart = totalPages - visibleCount + 1;
	const start = clamp(
		currentPage - pagesBeforeCurrent,
		FIRST_PAGE,
		lastPossibleStart,
	);
	return Array.from({ length: visibleCount }, (_, offset) => start + offset);
}

const clamp = (val: number, min: number, max: number) =>
	Math.min(Math.max(val, min), max);
