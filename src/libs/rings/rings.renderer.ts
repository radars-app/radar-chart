import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/d3-selection';
import { Dimension } from '../../models/dimension';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';

export class RingsRenderer {
	constructor(
		private container: D3Selection,
		private model: RingsModel,
		private config: RingsConfig,
		private size$: BehaviorSubject<Dimension>) {}
}
