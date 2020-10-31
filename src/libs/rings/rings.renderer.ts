import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { Dimension } from '../../models/dimension';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';
import { SectorsRenderer } from '../sectors/sectors.renderer';
import { convertToClassName } from '../helpers/convertToClassName';
import { ScaleLinear, scaleLinear, selectAll } from 'd3';
import { RingData } from 'src/models/ring-data';

export class RingsRenderer {

	private scaleX: ScaleLinear<number, number>;

	private sectorsContainer: D3Selection;
	private sectorsRenderer: SectorsRenderer;

	constructor(
		private container: D3Selection,
		private model: RingsModel,
		private config: RingsConfig,
		private size$: BehaviorSubject<Dimension>) {
			this.initContainers();
			this.initScaling();
			this.sectorsRenderer = new SectorsRenderer(
				this.sectorsContainer,
				this.model.sectors,
				this.config.sectorsConfig,
				this.size$
			);
			this.initBehavior();
		}

	private get ringNames(): string[] {
		return this.model.ringNames.getValue();
	}

	private initContainers(): void {
		this.sectorsContainer = selectAll('g.ring-container');
	}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringNames: string[]) => {
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

	private calculateRingsData(): RingData[] {
		const deltaRadius: number = this.config.ringsContainerRadius / this.ringNames.length;

		const ringRadiuses: RingData[] = this.ringNames.map((name: string, index: number) => {
			return {
				name,
				className: `${convertToClassName(name)}-${index}`,
				radius: {
					innerRadius: index * deltaRadius,
					outerRadius: (index + 1) * deltaRadius,
				}
			};
		});

		return ringRadiuses;
	}

	private update(): void {
		const rings: RingData[] = this.calculateRingsData();

		const ringsUpdate: D3Selection = this.container.selectAll('g.ring-container')
			.data(rings.reverse())
			.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
			.attr('transform', `translate(${this.scaleX(this.config.ringsContainerRadius)}, ${this.scaleX(this.config.ringsContainerRadius)})`);

		const ringsEnter: D3Selection = ringsUpdate
			.enter()
				.append('g')
				.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
				.attr('transform', `translate(${this.scaleX(this.config.ringsContainerRadius)}, ${this.scaleX(this.config.ringsContainerRadius)})`);

		const ringsExit: D3Selection = ringsUpdate.exit().remove();

		this.sectorsContainer = ringsEnter;
	}
}
