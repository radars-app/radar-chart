import { BehaviorSubject } from 'rxjs';
import { DividersModel } from '../dividers/dividers.model';

export class RingsModel {

	public readonly ringNames: BehaviorSubject<string[]>;

	constructor() {
		this.ringNames = new BehaviorSubject([]);
	}
}
