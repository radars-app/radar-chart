import { BehaviorSubject } from 'rxjs';
import { LabelsConfig } from './labels.config';
import { Dimension } from '../../models/dimension';
import { RingData } from 'src/models/ring-data';
import { selectAll } from 'd3';

export class LabelsRenderer {
	constructor(
		public readonly config$: LabelsConfig,
		private range$: BehaviorSubject<Dimension>
	) {}

	public render(sectorClassName: string): void {
		selectAll(`g.sector-container.${sectorClassName}`)
			.append('text')
			.text('a');
	}
}

// this.labelsRenderer = new LabelsRenderer(
// 	new BehaviorSubject(this.config.labelsConfig),
// 	this.range$
// );
