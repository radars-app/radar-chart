import { entries, pie, PieArcDatum } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { Dimension } from '../../models/dimension';
import { D3Pie } from '../../models/types/d3-pie';
import { SectorsConfig } from './sectors.config';
import { SectorsModel } from './sectors.model';
import { D3PieData } from '../../models/types/d3-pie-data';

export class SectorsRenderer {
	constructor(
		private container: D3Selection,
		private model: SectorsModel,
		private config: SectorsConfig,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initBehavior();
	}

	private initBehavior(): void {
		this.model.sectorNames.subscribe((ringsName: string[]) => {
			this.update();
		});
	}

	private initContainers(): void {}

	private update(): void {}

	private calculateSectorsData(): D3PieData {
		const sectorsProportion: D3Pie = pie().value(() => 1);
		const sectorsData: D3PieData = sectorsProportion(entries({...this.model.sectorNames.getValue()}));
		return sectorsData;
	}
}
