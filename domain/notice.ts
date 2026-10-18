export const NOTICE_QUERY_PARAM = "notice";

export const NOTICES = {
	created: "Quote created successfully.",
	updated: "Quote updated successfully.",
	deleted: "Quote deleted successfully.",
} as const;

export type NoticeCode = keyof typeof NOTICES;

export function parseNoticeCode(raw: string | null): NoticeCode | undefined {
	return raw !== null && Object.hasOwn(NOTICES, raw)
		? (raw as NoticeCode)
		: undefined;
}
