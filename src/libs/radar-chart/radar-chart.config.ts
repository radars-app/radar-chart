import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';

export class RadarChartConfig {
	public readonly domainX: number = 1366;
	public readonly domainY: number = 658;

	public readonly transformX: number;
	public readonly transformY: number;
	public readonly ringsContainerSize: number;
	public readonly minHeight: number;
	public readonly backgroundColor: string;
	public readonly ringsConfig: RingsConfig;

	constructor() {
		this.transformX = 542;
		this.transformY = 18;
		this.ringsContainerSize = 622;
		this.minHeight = this.ringsContainerSize + this.transformY * 2;
		this.backgroundColor = '#99A6B5';
		this.ringsConfig = new RingsConfig();
	}
}
