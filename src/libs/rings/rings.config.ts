import { SectorsConfig } from '../sectors/sectors.config';

export class RingsConfig {
	public readonly sectorsConfig: SectorsConfig;

	constructor() {
		this.sectorsConfig = new SectorsConfig();
	}
}
