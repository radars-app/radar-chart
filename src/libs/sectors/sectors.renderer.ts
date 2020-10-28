import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/d3-selection';
import { Dimension } from '../../models/dimension';
import { SectorsConfig } from './sectors.config';
import { SectorsModel } from './sectors.model';

export class SectorsRenderer {
	constructor(
		private container: D3Selection,
		private model: SectorsModel,
		private config: SectorsConfig,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initContainers();
	}

	private initContainers(): void {
	}
}
