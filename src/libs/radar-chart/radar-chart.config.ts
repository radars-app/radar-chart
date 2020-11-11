import './radar-chart.scss';
import { RingsConfig } from '../rings/rings.config';
import { DividersConfig } from '../dividers/dividers.config';

export class RadarChartConfig {
	public backgroundColor: string;
	public offsetLeft: number;
	public marginLeftRight: number;
	public marginTopBottom: number;
	public readonly ringsConfig: RingsConfig;
	public readonly dividersConfig: DividersConfig;

	constructor() {
		this.offsetLeft = 540;
		this.marginLeftRight = 1;
		this.marginTopBottom = 18;
		this.backgroundColor = '#F0F4F8';
		this.ringsConfig = new RingsConfig();
		this.dividersConfig = new DividersConfig();
	}
}
