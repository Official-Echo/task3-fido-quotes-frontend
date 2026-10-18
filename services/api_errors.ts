import type { Context } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import type { QuoteDraftErrors } from "@/domain/quote_validation.ts";
import type { State } from "@/utils.ts";
import { BackendError } from "./quotes_api.ts";

export class RequestError extends Error {
	constructor(
		readonly status: number,
		message: string,
		readonly fieldErrors: QuoteDraftErrors = {},
	) {
		super(message);
		this.name = "RequestError";
	}
}

export type ApiAction = (ctx: Context<State>) => Promise<Response>;

export function guardApi(action: ApiAction): ApiAction {
	return async (ctx) => {
		try {
			return await action(ctx);
		} catch (error) {
			return toErrorResponse(error);
		}
	};
}

export function toErrorResponse(error: unknown): Response {
	if (error instanceof RequestError) {
		return Response.json(
			{ message: error.message, fieldErrors: error.fieldErrors },
			{ status: error.status },
		);
	}
	if (error instanceof BackendError) {
		return Response.json(
			{ message: error.message },
			{
				status: isClientError(error.status)
					? error.status
					: STATUS_CODE.BadGateway,
			},
		);
	}
	console.error(error);
	return Response.json(
		{ message: "Unexpected server error" },
		{ status: STATUS_CODE.InternalServerError },
	);
}

function isClientError(status: number): boolean {
	return status >= 400 && status < 500;
}
