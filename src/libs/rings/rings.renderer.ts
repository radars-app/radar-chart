import { D3Selection } from '../../models/types/d3-selection';
import { RingsConfig } from './rings.config';
import { RingsModel } from './rings.model';
import { convertToClassName } from '../helpers/convert-to-class-name';
import { Ring } from '../../models/ring';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dimension } from '../../models/dimension';

export class RingsRenderer {

	private outerRingRadius: number;
	private rings: Ring[];

	constructor(
		private container: D3Selection,
		private model: RingsModel,
		public readonly config$: BehaviorSubject<RingsConfig>,
		private range$: BehaviorSubject<Dimension>) {
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

	private subscribeConfig(): void {
		this.config$.subscribe((config: RingsConfig) => {
			this.render();
		});
	}

	private initBehavior(): void {
		this.model.ringNames.subscribe((ringNames: string[]) => {
			this.render();
		});
	}

	private initSizing(): void {
		this.range$.subscribe(() => {
			this.render();
		});
	}

	private calculateRingsRadiuses(): void {
		this.outerRingRadius = Math.min(this.range.width, this.range.height) / 2;
		const deltaRadius: number = this.outerRingRadius / this.ringNames.length;

		this.rings = this.ringNames.map((name: string, index: number) => {
			return {
				name,
				className: `${convertToClassName(name)}-${index}`,
				radius: (index + 1) * deltaRadius
			};
		});
	}

	private update(container: D3Selection): D3Selection {
		return container
			.attr('class', (ring: Ring) => `ring ${ring.className}`)
			.attr('r', (ring: Ring) => ring.radius)
			.attr('fill', 'transparent')
			.attr('stroke', this.config.ringsColor)
			.attr('stroke-width', this.config.strokeWidth)
			.attr('transform', `translate(${this.outerRingRadius}, ${this.outerRingRadius})`);
	}

	private enter(container: D3Selection): void {
		const ringsToEnter: D3Selection = container.enter().append('circle');
		this.update(ringsToEnter);
	}

	private exit(container: D3Selection): void {
		container.exit().remove();
	}

	private render(): void {
		this.calculateRingsRadiuses();
		const container: D3Selection = this.container.selectAll('circle.ring').data(this.rings);

		this.enter(container);
		this.update(container);
		this.exit(container);
	}
}
