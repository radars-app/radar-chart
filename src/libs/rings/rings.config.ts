import { SectorsConfig } from '../sectors/sectors.config';

export class RingsConfig {
	public readonly ringsContainerRadius: number;
	public readonly sectorsConfig: SectorsConfig;

	constructor() {
		this.ringsContainerRadius = 311;
		this.sectorsConfig = new SectorsConfig();
	}
}
