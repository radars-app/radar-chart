import { D3Selection } from '../../models/types/d3-selection';
import { convertToClassName } from '../helpers/convert-to-class-name';
import { Ring } from '../../models/ring';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { combineLatest} from 'rxjs';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { SubscriptionPool } from '../helpers/subscription-pool';
import { calculateNewRingRange } from '../helpers/calculate-ring-range';

export class RingsRenderer {

	private subscriptions: SubscriptionPool;

	private rings: Ring[];
	private outerRingRadius: number;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		public readonly config$: BehaviorSubject<RadarChartConfig>
	) {
		this.initBehavior();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.ringNames$])
		.subscribe(([rangeX, rangeY, config, ringNames]: [number, number, RadarChartConfig, string[]]) => {
			const [newRangeX, newRangeY]: [number, number] = calculateNewRingRange(rangeX, rangeY, config);
			this.calculateRingsRadiuses(newRangeX, newRangeY, ringNames);
			this.render();
		});
	}

	private calculateRingsRadiuses(rangeX: number, rangeY: number, ringNames: string[]): void {
		this.outerRingRadius = Math.min(rangeX, rangeY) / 2;
		const deltaRadius: number = this.outerRingRadius / ringNames.length;

		this.rings = ringNames.map((name: string, index: number) => {
			return {
				name,
				radius: (index + 1) * deltaRadius
			};
		});
	}

	private render(): void {
		const ringsToUpdate: D3Selection = this.container.selectAll('circle.ring').data(this.rings);
		const ringsToEnter: D3Selection = ringsToUpdate.enter().append('circle');
		const ringsToExit: D3Selection = ringsToUpdate.exit();

		this.update(ringsToUpdate);
		this.enter(ringsToEnter);
		this.exit(ringsToExit);
	}

	private enter(container: D3Selection): void {
		this.renderRing(container);
	}

	private update(container: D3Selection): void {
		this.renderRing(container);
	}

	private exit(container: D3Selection): void {
		container.remove();
	}

	private renderRing(container: D3Selection): D3Selection {
		return container
			.attr('class', 'ring')
			.attr('fill', 'transparent')
			.attr('transform', `translate(${this.outerRingRadius}, ${this.outerRingRadius})`)
			.attr('r', (ring: Ring) => ring.radius)
			.attr('stroke', this.config$.getValue().ringsConfig.ringsColor)
			.attr('stroke-width', this.config$.getValue().ringsConfig.strokeWidth);
	}
}
