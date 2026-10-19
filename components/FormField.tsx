import { useId } from "preact/hooks";

interface FormFieldProps {
	label: string;
	value: string;
	maxLength: number;
	error?: string;
	multiline?: boolean;
	onInput: (value: string) => void;
	onBlur: () => void;
}

export function FormField(
	{ label, value, maxLength, error, multiline = false, onInput, onBlur }:
		FormFieldProps,
) {
	const inputId = useId();
	const errorId = `${inputId}-error`;
	const sharedProps = {
		id: inputId,
		class: "field__control",
		value,
		required: true,
		"aria-invalid": error !== undefined,
		"aria-describedby": error ? errorId : undefined,
		onBlur,
	};

	return (
		<div class="field">
			<label class="field__label" for={inputId}>{label}</label>
			{multiline
				? (
					<textarea
						{...sharedProps}
						rows={6}
						onInput={(event) => onInput(event.currentTarget.value)}
					/>
				)
				: (
					<input
						{...sharedProps}
						type="text"
						onInput={(event) => onInput(event.currentTarget.value)}
					/>
				)}
			<div class="field__meta">
				<span id={errorId} class="field__error">{error}</span>
				<span class="field__counter" aria-hidden="true">
					{value.length}/{maxLength}
				</span>
			</div>
		</div>
	);
}
