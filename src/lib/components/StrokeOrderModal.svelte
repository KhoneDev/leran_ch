<script lang="ts">
	import StrokeOrderCard from './StrokeOrderCard.svelte';
	import type { VocabEntry } from '$lib/data/vocab';

	interface Props {
		item: VocabEntry | null;
		open: boolean;
		onclose: () => void;
	}

	const { item, open, onclose }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onclose();
		}
	}

	function getExamples(v: VocabEntry | null): { icon: string; cn: string; th: string }[] {
		if (!v) return [];
		const out: { icon: string; cn: string; th: string }[] = [];
		for (const [icon, field] of [
			['💬', 'q'],
			['📝', 'a']
		] as const) {
			const e = v[field];
			if (e && typeof e === 'object') {
				if (e.cn || e.th) out.push({ icon, cn: e.cn || '', th: e.th || '' });
			} else if (typeof e === 'string' && e.trim()) {
				out.push({ icon, cn: e.trim(), th: '' });
			}
		}
		return out;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && item}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
		role="dialog"
		aria-modal="true"
		aria-labelledby="stroke-modal-title"
	>
		<!-- Backdrop click to close -->
		<button
			type="button"
			aria-label="Close backdrop"
			class="absolute inset-0 w-full h-full cursor-default -z-10 border-0 bg-transparent"
			onclick={onclose}
		></button>

		<div
			class="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
		>
			<StrokeOrderCard
				word={item.word}
				pinyin={item.pinyin}
				thai={item.thai}
				level={item.level}
				examples={getExamples(item)}
				autoPlay={true}
				onClose={onclose}
			/>
		</div>
	</div>
{/if}
