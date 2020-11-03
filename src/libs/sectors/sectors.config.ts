import { LabelsConfig } from '../labels/labels.config';

export class SectorsConfig {
	public dividerColor: string;
	public textColor: string;
	public readonly labelsConfig: LabelsConfig;

	constructor() {
		this.dividerColor = '#99A6B5';
		this.textColor = '#6B7885';
		this.labelsConfig = new LabelsConfig();
	}
}
