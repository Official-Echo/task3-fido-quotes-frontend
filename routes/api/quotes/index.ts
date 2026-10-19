import { STATUS_CODE } from "@std/http/status";
import { define } from "@/utils.ts";
import { guardApi } from "@/services/api_errors.ts";
import { getQuotesApi } from "@/services/container.ts";
import { readQuoteDraft } from "@/services/request_readers.ts";

export const handler = define.handlers({
	POST: guardApi(async (ctx) => {
		const draft = await readQuoteDraft(ctx.req);
		const id = await getQuotesApi().create(draft);
		return Response.json({ id }, { status: STATUS_CODE.Created });
	}),
});
