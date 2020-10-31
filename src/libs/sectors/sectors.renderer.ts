import { pie, arc, select, scaleLinear, ScaleLinear, Arc, DefaultArcObject, selectAll } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { Dimension } from '../../models/dimension';
import { D3Pie } from '../../models/types/d3-pie';
import { D3PieData } from '../../models/types/d3-pie-data';
import { RingData } from 'src/models/ring-data';
import { SectorsModel } from './sectors.model';
import { SectorsConfig } from './sectors.config';

export class SectorsRenderer {
	public scaleX: ScaleLinear<number, number>;

	constructor(
		private container: D3Selection,
		private model: SectorsModel,
		private config: SectorsConfig,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initScaling();
		this.initBehavior();
	}

	private get sectorNames(): string[] {
		return this.model.sectorNames.getValue();
	}

	private initBehavior(): void {
		this.model.sectorNames.subscribe((sectorNames: string[]) => {
			this.update();
		});
	}

	private initScaling(): void {
		this.size$.subscribe((size: Dimension) => {
			this.scaleX = scaleLinear()
				.domain([0, 1366]) // TODO: save domain in model as observable as 0
				.range([0, size.width]);
			this.update();
		});
	}

	private calculateSectorsData(): D3PieData {
		const initSectorsProportion: D3Pie = pie().value(() => 1);
		const sectorsData: D3PieData = initSectorsProportion(this.sectorNames);
		return sectorsData;
	}

	private getArcByRing(ring: RingData): Arc<any, any> {
		return arc()
			.innerRadius(this.scaleX(ring.radius.innerRadius))
			.outerRadius(this.scaleX(ring.radius.outerRadius));
	}

	private update(): void {
		const sectors: D3PieData = this.calculateSectorsData();

		this.container
			.each((ring: RingData) => {
				select(`g.ring-container.${ring.className}`)
					.selectAll('path.sector')
					.data(sectors)
						.enter()
							.append('path')
							.attr('d', this.getArcByRing(ring))
							.attr('class', `sector ${ring.className}`)
							.attr('fill', 'transparent')
							.attr('stroke', this.config.dividerColor);
			});

		this.container
			.each((ring: RingData) => {
					selectAll(`path.sector.${ring.className}`)
							.attr('d', this.getArcByRing(ring))
							.attr('class', `sector ${ring.className}`)
							.attr('fill', 'transparent')
							.attr('stroke', this.config.dividerColor);
			});
	}
}
