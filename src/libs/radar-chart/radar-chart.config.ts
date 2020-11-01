import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';

export class RadarChartConfig {
	public readonly transformX: number;
	public readonly transformY: number;
	public readonly minHeight: number;
	public readonly backgroundColor: string;
	public readonly ringsConfig: RingsConfig;

	constructor() {
		this.ringsConfig = new RingsConfig();
		this.transformX = 542;
		this.transformY = 18;
		this.minHeight = this.ringsConfig.ringsContainerRadius * 2 + this.transformY * 2;
		this.backgroundColor = '#F0F4F8';
	}
}
