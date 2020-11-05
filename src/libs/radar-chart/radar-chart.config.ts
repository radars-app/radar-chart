import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';
import { DividersConfig } from '../dividers/dividers.config';

export class RadarChartConfig {
	public backgroundColor: string;
	public transformX: number;
	public offsetX: number;
	public offsetY: number;
	public readonly containerDomainX: number;
	public readonly containerDomainY: number;
	public readonly ringsConfig: RingsConfig;
	public readonly dividersConfig: DividersConfig;

	constructor() {
		this.containerDomainX = 1366;
		this.containerDomainY = 658;
		this.transformX = 542;
		this.offsetX = 1;
		this.offsetY = 18;
		this.backgroundColor = '#F0F4F8';
		this.ringsConfig = new RingsConfig();
		this.dividersConfig = new DividersConfig();
	}
}
