import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { SectorModel } from '../sector/sector.model';

export class RootCircleModel {

	public readonly sector: BehaviorSubject<SectorModel>;

	constructor() {}
}
