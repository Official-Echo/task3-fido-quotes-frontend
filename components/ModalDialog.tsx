import type { ComponentChildren } from "preact";
import { useEffect, useId, useRef } from "preact/hooks";

interface ModalDialogProps {
	title: string;
	onClose: () => void;
	children: ComponentChildren;
}

export function ModalDialog({ title, onClose, children }: ModalDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();

	useEffect(() => {
		dialogRef.current?.showModal();
	}, []);

	function closeOnBackdropClick(event: MouseEvent) {
		if (event.target === dialogRef.current) onClose();
	}

	return (
		<dialog
			ref={dialogRef}
			class="dialog"
			aria-labelledby={titleId}
			onClose={onClose}
			onClick={closeOnBackdropClick}
		>
			<div class="dialog__content">
				<h2 id={titleId} class="dialog__title">{title}</h2>
				{children}
			</div>
		</dialog>
	);
}
