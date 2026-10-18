import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { type NoticeCode, NOTICES } from "@/domain/notice.ts";

interface NoticeToastProps {
	code: NoticeCode;
}

export default function NoticeToast({ code }: NoticeToastProps) {
	const visible = useSignal(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			visible.value = false;
		}, 4000);
		return () => clearTimeout(timer);
	}, []);

	if (!visible.value) return null;

	return (
		<div class="toast" role="status" aria-live="polite">
			<p class="toast__message">{NOTICES[code]}</p>
			<button
				type="button"
				class="toast__close"
				aria-label="Dismiss"
				onClick={() => (visible.value = false)}
			>
				×
			</button>
		</div>
	);
}
