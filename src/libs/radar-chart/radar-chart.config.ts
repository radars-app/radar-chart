import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';

export class RadarChartConfig {
	public readonly domainX: number = 1366;
	public readonly domainY: number = 658;

	public readonly transformX: number;
	public readonly transformY: number;
	public readonly minHeight: number;
	public readonly backgroundColor: string;
	public readonly ringsConfig: RingsConfig;

	constructor() {
		this.ringsConfig = new RingsConfig();
		this.transformX = 542;
		this.transformY = 18;
		this.minHeight = this.ringsConfig.ringsContainerSize + this.transformY * 2;
		this.backgroundColor = '#99A6B5';
	}
}
