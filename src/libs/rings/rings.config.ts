import { SectorsConfig } from '../sectors/sectors.config';

export class RingsConfig {
	public readonly ringsContainerSize: number;
	public readonly sectorsConfig: SectorsConfig;

	constructor() {
		this.ringsContainerSize = 622;
		this.sectorsConfig = new SectorsConfig();
	}
}
