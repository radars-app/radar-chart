import { D3Selection } from '../../models/types/d3-selection';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';
import { SectorsRenderer } from '../sectors/sectors.renderer';
import { convertToClassName } from '../helpers/convertToClassName';
import { RingData } from 'src/models/ring-data';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dimension } from 'src/models/dimension';

export class RingsRenderer {

	private outerRingRadius: number;

	private sectorsRenderer: SectorsRenderer;

	constructor(
		private container: D3Selection,
		private model: RingsModel,
		public readonly config$: BehaviorSubject<RingsConfig>,
		private range$: BehaviorSubject<Dimension>) {
			this.sectorsRenderer = new SectorsRenderer(
				this.model.sectors,
				new BehaviorSubject(this.config.sectorsConfig),
				this.range$
			);
			this.subscribeConfig();
			this.initBehavior();
			this.initSizing();
		}

	private get config(): RingsConfig {
		return this.config$.getValue();
	}

	private get range(): Dimension {
		return this.range$.getValue();
	}

	private get ringNames(): string[] {
		return this.model.ringNames.getValue();
	}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringNames: string[]) => {
			this.render();
		});
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RingsConfig) => {
			this.sectorsRenderer.config$.next(config.sectorsConfig);
			this.render();
		});
	}

	private initSizing(): void {
		this.range$.subscribe(() => {
			this.render();
		});
	}

	private calculateRingsRadiuses(): RingData[] {
		const deltaRadius: number = this.outerRingRadius / this.ringNames.length;

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
				.attr('transform', `translate(${this.outerRingRadius}, ${this.outerRingRadius})`);
	}

	private update(dataBinding: D3Selection): void {
		dataBinding
			.attr('class', (ring: RingData) => `ring-container ${ring.className}`)
			.attr('transform', `translate(${this.outerRingRadius}, ${this.outerRingRadius})`)
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
		this.outerRingRadius = Math.min(this.range.width, this.range.height) / 2;
		const ringsDataBind: D3Selection = this.container.selectAll('g.ring-container').data(this.calculateRingsRadiuses());
		this.enter(ringsDataBind);
		this.update(ringsDataBind);
		this.exit(ringsDataBind);

		this.sectorsRenderer.render();
	}
}
