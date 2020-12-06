export class DotsConfig {
	public dotOffset: number;
	public dotRadius: number;

	public numberFontSize: number;
	public numberFontFamily: string;

	public get dotDiameterWithOffsets(): number {
		return 2 * this.dotOffset + 2 * this.dotRadius;
	}

	constructor() {
		this.dotOffset = 3;
		this.dotRadius = 7;
		this.numberFontFamily = 'Roboto, sans-serif';
		this.numberFontSize = 7;
	}
}
