import { expect } from "@std/expect";
import { STATUS_CODE } from "@std/http/status";
import { RequestError, toErrorResponse } from "@/services/api_errors.ts";
import { BackendError } from "@/services/quotes_api.ts";

Deno.test("toErrorResponse maps RequestError with fieldErrors", async () => {
	const error = new RequestError(STATUS_CODE.UnprocessableEntity, "invalid", {
		author: "Author is required",
	});
	const response = toErrorResponse(error);
	expect(response.status).toBe(422);
	const body = await response.json();
	expect(body).toEqual({
		message: "invalid",
		fieldErrors: { author: "Author is required" },
	});
});

Deno.test("toErrorResponse preserves 4xx BackendError status", async () => {
	const error = new BackendError(404, "The quote no longer exists");
	const response = toErrorResponse(error);
	expect(response.status).toBe(404);
	const body = await response.json();
	expect(body.message).toBe("The quote no longer exists");
});

Deno.test("toErrorResponse maps 5xx BackendError to 502", () => {
	const error = new BackendError(500, "boom");
	const response = toErrorResponse(error);
	expect(response.status).toBe(502);
});

Deno.test("toErrorResponse maps unknown errors to 500", async () => {
	const response = toErrorResponse(new Error("surprise"));
	expect(response.status).toBe(500);
	const body = await response.json();
	expect(body.message).toBe("Unexpected server error");
});
