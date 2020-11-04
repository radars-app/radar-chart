import { LabelsConfig } from '../labels/labels.config';

export class RingsConfig {
	public ringsColor: string;
	public strokeWidth: number;
	public labelsConfig: LabelsConfig;

	constructor() {
		this.ringsColor = '#99A6B5';
		this.strokeWidth = 1;
		this.labelsConfig = new LabelsConfig();
	}
}
