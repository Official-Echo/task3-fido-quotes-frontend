import { useSignal } from "@preact/signals";

const UNKNOWN_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function useSubmission() {
	const isPending = useSignal(false);
	const errorMessage = useSignal<string | null>(null);

	async function run(action: () => Promise<void>): Promise<void> {
		isPending.value = true;
		errorMessage.value = null;
		try {
			await action();
		} catch (error) {
			errorMessage.value = error instanceof Error
				? error.message
				: UNKNOWN_ERROR_MESSAGE;
			isPending.value = false;
		}
	}

	return { isPending, errorMessage, run };
}
