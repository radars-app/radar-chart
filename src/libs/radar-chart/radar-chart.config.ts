import { RingsConfig } from '../rings/rings.config';
import { DividersConfig } from '../dividers/dividers.config';
import { DotsConfig } from '../dots/dots.config';

export class RadarChartConfig {
	public backgroundColor: string;
	public offsetLeft: number;
	public offsetRight: number;
	public marginLeftRight: number;
	public marginTopBottom: number;
	public zoomTransitionTime: number = 300;
	public readonly ringsConfig: RingsConfig;
	public readonly dividersConfig: DividersConfig;
	public readonly dotsConfig: DotsConfig;

	constructor() {
		this.offsetLeft = 340;
		this.offsetRight = 202;
		this.marginLeftRight = 1;
		this.marginTopBottom = 18;
		this.backgroundColor = '#F0F4F8';
		this.ringsConfig = new RingsConfig();
		this.dividersConfig = new DividersConfig();
		this.dotsConfig = new DotsConfig();
	}
}
