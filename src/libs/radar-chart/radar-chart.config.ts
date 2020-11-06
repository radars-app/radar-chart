import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';
import { DividersConfig } from '../dividers/dividers.config';

export class RadarChartConfig {
	public backgroundColor: string;
	public transformX: number;
	public offsetLeftRight: number;
	public offsetTopBottom: number;
	public readonly containerDomainX: number;
	public readonly ringsConfig: RingsConfig;
	public readonly dividersConfig: DividersConfig;

	constructor() {
	//	this.transformX = 542; //	rename var
		this.offsetLeftRight = 1;
		this.offsetTopBottom = 18;
		this.backgroundColor = '#F0F4F8';
		this.ringsConfig = new RingsConfig();
		this.dividersConfig = new DividersConfig();
	}
}
