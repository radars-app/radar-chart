export class DotsConfig {
	public dotOffset: number = 6; // default 3
	public dotRadius: number = 5; // default 5

	public get dotDiameterWithOffsets(): number {
		return 2 * this.dotOffset + 2 * this.dotRadius;
	}

	constructor() {}
}
