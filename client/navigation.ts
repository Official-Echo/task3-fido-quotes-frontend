import {
	buildListHref,
	type ListQuery,
	parseListQuery,
} from "@/domain/list_query.ts";
import type { NoticeCode } from "@/domain/notice.ts";

export function readCurrentListQuery(): ListQuery {
	return parseListQuery(new URL(globalThis.location.href).searchParams);
}

export function showListWithNotice(query: ListQuery, notice: NoticeCode): void {
	globalThis.location.assign(buildListHref(query, notice));
}
