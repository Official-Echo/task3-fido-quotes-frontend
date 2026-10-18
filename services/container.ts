import { loadAppConfig } from "@/config/app_config.ts";
import { createQuotesApi, type QuotesApi } from "./quotes_api.ts";

let quotesApi: QuotesApi | undefined;

export function getQuotesApi(): QuotesApi {
	quotesApi ??= createQuotesApi(loadAppConfig().backendUrl);
	return quotesApi;
}
