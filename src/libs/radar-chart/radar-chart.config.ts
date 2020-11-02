import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';

export class RadarChartConfig {
	public backgroundColor: string;
	public transformX: number;
	public offsetY: number;
	public readonly containerDomainX: number;
	public readonly ringsConfig: RingsConfig;

	constructor() {
		this.containerDomainX = 1366;
		this.ringsConfig = new RingsConfig();
		this.transformX = 542;
		this.offsetY = 18;
		this.backgroundColor = '#F0F4F8';
	}
}
