import { D3Selection } from '../../models/types/d3-selection';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';
import { SectorsRenderer } from '../sectors/sectors.renderer';
import { convertToClassName } from '../helpers/convertToClassName';
import { RingData } from 'src/models/ring-data';
import { Scaler } from '../helpers/scaler';

export class RingsRenderer {

	private sectorsRenderer: SectorsRenderer;

	constructor(
		private container: D3Selection,
		private model: RingsModel,
		private config: RingsConfig,
		private scaler: Scaler) {
			this.sectorsRenderer = new SectorsRenderer(
				this.model.sectors,
				this.config.sectorsConfig,
				this.scaler
			);
			this.initBehavior();
			this.initScaling();
		}

	private get ringNames(): string[] {
		return this.model.ringNames.getValue();
	}

	private initScaling(): void {
		this.scaler.containerUpdaters.push(this.render.bind(this));
	}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringNames: string[]) => {
			this.render();
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

	private enter(dataBinding: D3Selection): void {
		dataBinding
			.enter()
				.append('g')
				.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
				.attr('transform', `translate(${this.scaler.containerX(this.config.ringsContainerRadius)}, ${this.scaler.containerX(this.config.ringsContainerRadius)})`);
	}

	private update(dataBinding: D3Selection): void {
		dataBinding
			.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
			.attr('transform', `translate(${this.scaler.containerX(this.config.ringsContainerRadius)}, ${this.scaler.containerX(this.config.ringsContainerRadius)})`)
				.each(function(ring: RingData): void {
					const sectors: NodeList = this.childNodes;
					sectors.forEach((sector: SVGElement) => {
						sector.classList.value = `sector ${ring.className}`;
					});
				});
	}

	private exit(dataBinding: D3Selection): void {
		dataBinding
			.exit()
				.remove();
	}

	private render(): void {
		const ringsDataBind: D3Selection = this.container.selectAll('g.ring-container').data(this.calculateRingsData());
		this.enter(ringsDataBind);
		this.update(ringsDataBind);
		this.exit(ringsDataBind);

		this.sectorsRenderer.render();
	}
}
