import { Dimension } from '../../models/dimension';
import { DividersModel } from './dividers.model';
import { DividersConfig } from './dividers.config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { D3Selection } from 'src/models/types/d3-selection';
import { Divider } from 'src/models/divider';
import './dividers.scss';

export class DividersRenderer {

	private outerRingRadius: number;
	private dividers: Divider[];

	constructor(
		private container: D3Selection,
		private model: DividersModel, // chart model
		public readonly config$: BehaviorSubject<DividersConfig>,
		private range$: BehaviorSubject<Dimension>
	) {
		this.subscribeConfig();
		this.initBehavior();
		this.initSizing();
	}

	private get config(): DividersConfig {
		return this.config$.getValue();
	}

	private get sectorNames(): string[] {
		return this.model.sectorNames.getValue();
	}

	private get range(): Dimension {
		return this.range$.getValue();
	}

	private initBehavior(): void {
		this.model.sectorNames.subscribe((sectorNames: string[]) => {
			this.render();
		});
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: DividersConfig) => {
			this.render();
		});
	}

	private initSizing(): void {
		this.range$.subscribe(() => {
			this.render();
		});
	}

	private calculateDividers(): void {
		this.outerRingRadius = Math.min(this.range.width, this.range.height) / 2;
		const rotationDelta: number = 360 / this.sectorNames.length;

		let currentRotation: number = -rotationDelta;
		this.dividers = this.sectorNames.map((sectorName: string, index: number) => {
			return {
				label: sectorName,
				isLabeled: index === 0,
				rotation: currentRotation += rotationDelta
			};
		});
	}

	private update(container: D3Selection): void {
		container
			.attr('class', 'divider')
			.attr('x1', this.outerRingRadius).attr('y1', this.outerRingRadius)
			.attr('x2', this.outerRingRadius * 2).attr('y2', this.outerRingRadius)
			.attr('stroke', this.config.dividerColor)
			.attr('stroke-width', this.config.strokeWidth);
	}

	private enter(container: D3Selection): void {
		const dividersToEnter: D3Selection = container
			.enter()
				.append('g')
					.attr('class', 'divider-container')
						.append('line');

		this.update(dividersToEnter);
	}

	private exit(container: D3Selection): void {
		container.exit().remove();
	}

	private render(): void {
		this.calculateDividers();
		const dividerContainer: D3Selection = this.container.selectAll('g.divider-container').data(this.dividers)
			.attr('transform', (divider: Divider) => `rotate(${divider.rotation}, ${this.outerRingRadius}, ${this.outerRingRadius})`);
		const container: D3Selection = this.container.selectAll('g.divider-container > line.divider').data(this.dividers);

		this.enter(container);
		this.update(container);
		this.exit(dividerContainer);
	}
}
