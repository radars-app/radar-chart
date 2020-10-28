import { BehaviorSubject } from 'rxjs';
import { D3Selection } from 'src/models/d3-selection';

export class SectorsModel {

	public readonly sectorNames: BehaviorSubject<string[]>;

	constructor() {
		this.sectorNames = new BehaviorSubject([]);
	}
}
