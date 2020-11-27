export function calculateRingsRadiuses(range: number, ringNames: string[]): number[] {
	const deltaRadius: number = range / ringNames.length;
	return ringNames.map((name: string, index: number) => (index + 1) * deltaRadius);
}
