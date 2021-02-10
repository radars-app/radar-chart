export class DotsConfig {
	public hasClickAction: boolean;
	public hasHoverAction: boolean;

	public dotOffset: number;
	public dotRadius: number;
	public clusterRadius: number;

	public isNumberShown: boolean;
	public numberFontSize: number;
	public clusterNumberFontSize: number;
	public numberFontFamily: string;
	public starFontSize: number;

	public get dotDiameterWithOffsets(): number {
		return 2 * this.dotOffset + 2 * this.dotRadius;
	}

	constructor() {
		this.starFontSize = 14;
		this.dotOffset = 3;
		this.dotRadius = 7;
		this.clusterRadius = 8;
		this.hasClickAction = true;
		this.hasHoverAction = true;
		this.isNumberShown = true;
		this.numberFontFamily = 'Roboto, sans-serif';
		this.numberFontSize = 7;
		this.clusterNumberFontSize = 6;
	}
}
