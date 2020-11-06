import { RadarChartConfig } from '../radar-chart/radar-chart.config';

export function calculateNewRingRange(rangeX: number, rangeY: number, config: RadarChartConfig): [number, number] {
	return [
		rangeX - config.offsetLeftRight * 2,
		rangeY - config.offsetTopBottom * 2
	];
}
