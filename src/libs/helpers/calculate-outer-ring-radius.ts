import { RadarChartConfig } from '../radar-chart/radar-chart.config';

export function calculateOuterRingRadius(rangeX: number, rangeY: number, config: RadarChartConfig): number {
	const [newRangeX, newRangeY]: [number, number] = [rangeX - config.marginLeftRight * 2, rangeY - config.marginTopBottom * 2];
	return Math.min(newRangeX, newRangeY) / 2;
}
