import { entries, pie } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { Dimension } from '../../models/dimension';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';

export class RingsRenderer {
	constructor(
		private container: D3Selection,
		private model: RingsModel,
		private config: RingsConfig,
		private size$: BehaviorSubject<Dimension>) {
			this.initBehavior();
		}

	private initRings(): void {}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringsName: string[]) => {
			this.update();
		});
	}

	private update(): void {}
}
