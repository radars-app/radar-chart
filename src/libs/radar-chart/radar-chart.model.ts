import { DividersModel } from '../dividers/dividers.model';
import { RingsModel } from '../rings/rings.model';

export class RadarChartModel {

	public readonly rings: RingsModel;
	public readonly dividers: DividersModel;

	constructor() {
		this.rings = new RingsModel();
		this.dividers = new DividersModel();
	}
}
