import { STATUS_CODE } from "@std/http/status";
import { define } from "@/utils.ts";
import { guardApi } from "@/services/api_errors.ts";
import { getQuotesApi } from "@/services/container.ts";
import { readQuoteDraft, readQuoteId } from "@/services/request_readers.ts";

export const handler = define.handlers({
	PUT: guardApi(async (ctx) => {
		const id = readQuoteId(ctx.params);
		const draft = await readQuoteDraft(ctx.req);
		await getQuotesApi().update(id, draft);
		return new Response(null, { status: STATUS_CODE.NoContent });
	}),

	DELETE: guardApi(async (ctx) => {
		await getQuotesApi().remove(readQuoteId(ctx.params));
		return new Response(null, { status: STATUS_CODE.NoContent });
	}),
});
