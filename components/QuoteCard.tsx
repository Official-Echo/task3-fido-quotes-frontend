import type { Quote } from "@/domain/quote.ts";
import { QuoteActions } from "@/islands/QuoteActions.tsx";

interface QuoteCardProps {
	quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
	return (
		<article class="quote-card">
			<blockquote class="quote-card__text">
				<p>{quote.text}</p>
			</blockquote>
			<footer class="quote-card__footer">
				<cite class="quote-card__author">— {quote.author}</cite>
				<QuoteActions quote={quote} />
			</footer>
		</article>
	);
}
