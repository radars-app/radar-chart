import { RadarChartConfig } from '../radar-chart/radar-chart.config';

export function calculateNewRingRange(rangeX: number, rangeY: number, config: RadarChartConfig): [number, number] {
	return [
		rangeX - config.marginLeftRight * 2,
		rangeY - config.marginTopBottom * 2
	];
}
