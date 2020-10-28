import { BehaviorSubject } from 'rxjs';
import { SectorsModel } from '../sectors/sectors.model';

export class RingsModel {

	public readonly ringNames: BehaviorSubject<string[]>;
	public readonly sectors: SectorsModel;

	constructor() {
		this.ringNames = new BehaviorSubject([]);
		this.sectors = new SectorsModel();
	}
}
