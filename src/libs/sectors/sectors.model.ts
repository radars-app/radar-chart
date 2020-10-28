import { BehaviorSubject } from 'rxjs';

export class SectorsModel {

	public readonly sectorNames: BehaviorSubject<string[]>;

	constructor() {
		this.sectorNames = new BehaviorSubject([]);
	}
}
