import { RingsModel } from '../rings/rings.model';

export class RadarChartModel {

	public readonly rings: RingsModel;

	constructor() {
		this.rings = new RingsModel(); // можно предеавать range
	}
}
