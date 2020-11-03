import { pie, arc, select, Arc, selectAll, scaleOrdinal } from 'd3';
import { D3Selection } from '../../models/types/d3-selection';
import { D3Pie } from '../../models/types/d3-pie';
import { D3PieData } from '../../models/types/d3-pie-data';
import { RingData as RingData } from 'src/models/ring-data';
import { SectorsModel } from './sectors.model';
import { SectorsConfig } from './sectors.config';
import { Dimension } from 'src/models/dimension';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LabelsRenderer } from '../labels/labels.renderer';

export class SectorsRenderer {

	constructor(
		private model: SectorsModel,
		public readonly config$: BehaviorSubject<SectorsConfig>,
		private range$: BehaviorSubject<Dimension>
	) {
		this.initBehavior();
	}

	private get config(): SectorsConfig {
		return this.config$.getValue();
	}

	private get sectorNames(): string[] {
		return this.model.sectorNames.getValue();
	}

	public render(): void {
		const sectors: D3PieData = this.calculateSectorsData();

		selectAll('g.ring-container')
			.each((ringRadiuses: RingData) => {
					const containerToUpdate: D3Selection = select(`g.ring-container.${ringRadiuses.className}`).selectAll('path.sector').data(sectors);
					const containerToExit: D3Selection = selectAll(`g.sector-container.${ringRadiuses.className}`).data(sectors);
					this.enter(containerToUpdate, ringRadiuses);
					this.update(containerToUpdate, ringRadiuses);
					this.exit(containerToExit);
				}
			);
	}

	private initBehavior(): void {
		this.model.sectorNames.subscribe((sectorNames: string[]) => {
			this.render();
		});
	}

	private calculateSectorsData(): D3PieData {
		const initSectorsProportion: D3Pie = pie().value(() => 1);
		const sectorsData: D3PieData = initSectorsProportion(this.sectorNames);
		return sectorsData;
	}

	private getArcByRing(ring: RingData): Arc<any, any> {
		return arc()
			.innerRadius(ring.radius.innerRadius)
			.outerRadius(ring.radius.outerRadius);
	}

	private enter(container: D3Selection, ring: RingData): void {
		container
			.enter()
				.append('g')
				.attr('class', `sector-container ${ring.className}`)
				.append('path')
				.attr('d', this.getArcByRing(ring))
				.attr('class', `sector ${ring.className}`)
				.attr('fill', 'transparent')
				.attr('stroke', this.config.dividerColor);
	}

	private update(container: D3Selection, ring: RingData): void {
		container
			.attr('d', this.getArcByRing(ring))
			.attr('class', `sector ${ring.className}`)
			.attr('fill', 'transparent')
			.attr('stroke', this.config.dividerColor);
	}

	private exit(container: D3Selection): void {
		container.exit().remove();
	}
}
