import { expect } from "@std/expect";
import { loadAppConfig } from "@/config/app_config.ts";

function fakeEnv(map: Record<string, string | undefined>) {
	return {
		get(key: string): string | undefined {
			return map[key];
		},
	};
}

Deno.test("loadAppConfig throws when BACKEND_URL is missing", () => {
	expect(() => loadAppConfig(fakeEnv({}))).toThrow(
		/BACKEND_URL is not set/,
	);
});

Deno.test("loadAppConfig parses a valid URL and appends trailing slash", () => {
	const config = loadAppConfig(
		fakeEnv({ BACKEND_URL: "http://localhost:8080" }),
	);
	expect(config.backendUrl.href).toBe("http://localhost:8080/");
});

Deno.test("loadAppConfig keeps an existing trailing slash", () => {
	const config = loadAppConfig(
		fakeEnv({ BACKEND_URL: "https://api.example.com/v1/" }),
	);
	expect(config.backendUrl.href).toBe("https://api.example.com/v1/");
});

Deno.test("loadAppConfig rejects an invalid URL", () => {
	expect(() => loadAppConfig(fakeEnv({ BACKEND_URL: "not-a-url" })))
		.toThrow();
});
