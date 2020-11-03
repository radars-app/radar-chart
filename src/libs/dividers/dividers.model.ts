import { BehaviorSubject } from 'rxjs';

export class DividersModel {

	public readonly sectorNames: BehaviorSubject<string[]>;

	constructor() {
		this.sectorNames = new BehaviorSubject([]);
	}
}
