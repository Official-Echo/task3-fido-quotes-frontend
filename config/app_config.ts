const BACKEND_URL_VARIABLE = "BACKEND_URL";

export interface AppConfig {
	readonly backendUrl: URL;
}

export function loadAppConfig(
	env: Pick<typeof Deno.env, "get"> = Deno.env,
): AppConfig {
	const rawUrl = env.get(BACKEND_URL_VARIABLE);
	if (!rawUrl) {
		throw new Error(
			`Environment variable ${BACKEND_URL_VARIABLE} is not set`,
		);
	}
	return { backendUrl: withTrailingSlash(new URL(rawUrl)) };
}

function withTrailingSlash(url: URL): URL {
	return url.pathname.endsWith("/") ? url : new URL(`${url.href}/`);
}
