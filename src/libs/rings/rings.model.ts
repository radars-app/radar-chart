import { BehaviorSubject } from 'rxjs';

export class RingsModel {

	public readonly ringNames: BehaviorSubject<string[]>;

	constructor() {
		this.ringNames = new BehaviorSubject([]);
	}
}
