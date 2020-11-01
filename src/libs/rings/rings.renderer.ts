import { BehaviorSubject } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { Dimension } from '../../models/dimension';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';
import { SectorsRenderer } from '../sectors/sectors.renderer';
import { convertToClassName } from '../helpers/convertToClassName';
import { ScaleLinear, scaleLinear, selectAll } from 'd3';
import { RingData } from 'src/models/ring-data';
import { Scaler } from '../helpers/scaler';

export class RingsRenderer {

	private sectorsContainer: D3Selection;
	private sectorsRenderer: SectorsRenderer;

	constructor(
		private container: D3Selection,
		private model: RingsModel,
		private config: RingsConfig,
		private scaler: Scaler) {
			this.initContainers();
			this.initBehavior();
			this.sectorsRenderer = new SectorsRenderer(
				this.sectorsContainer,
				this.model.sectors,
				this.config.sectorsConfig,
				this.scaler
			);
			this.initScaling();
		}

	private get ringNames(): string[] {
		return this.model.ringNames.getValue();
	}

	private initScaling(): void {
		this.scaler.containerUpdaters.push(this.update.bind(this));
	}

	private initContainers(): void {
		this.sectorsContainer = selectAll('g.ring-container');
	}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringNames: string[]) => {
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
			.data(rings)
			.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
			.attr('transform', `translate(${this.scaler.containerX(this.config.ringsContainerRadius)}, ${this.scaler.containerX(this.config.ringsContainerRadius)})`);

		const ringsEnter: D3Selection = ringsUpdate
			.enter()
				.append('g')
				.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
				.attr('transform', `translate(${this.scaler.containerX(this.config.ringsContainerRadius)}, ${this.scaler.containerX(this.config.ringsContainerRadius)})`);

		const ringsExit: D3Selection = ringsUpdate.exit().remove();

		this.sectorsContainer = ringsEnter;
	}
}
