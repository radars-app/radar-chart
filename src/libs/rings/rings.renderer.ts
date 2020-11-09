import { D3Selection } from '../../models/types/d3-selection';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { combineLatest} from 'rxjs';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { SubscriptionPool } from '../helpers/subscription-pool';
import { calculateNewRingRange } from '../helpers/calculate-ring-range';

export class RingsRenderer {

	private subscriptions: SubscriptionPool;

	private ringsRadiuses: number[];

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
			const range: number = this.calculateRange(rangeX, rangeY, config);
			this.calculateRingsRadiuses(range, ringNames);
			this.render(range);
		});
	}

	private calculateRange(rangeX: number, rangeY: number, config: RadarChartConfig): number {
		const [newRangeX, newRangeY]: [number, number] = calculateNewRingRange(rangeX, rangeY, config);
		return Math.min(newRangeX, newRangeY) / 2;
	}

	private calculateRingsRadiuses(range: number, ringNames: string[]): void {
		const deltaRadius: number = range / ringNames.length;

		this.ringsRadiuses = ringNames.map((name: string, index: number) =>  (index + 1) * deltaRadius);
	}

	private render(range: number): void {
		const ringsToUpdate: D3Selection = this.container.selectAll('circle.ring').data(this.ringsRadiuses);
		const ringsToEnter: D3Selection = ringsToUpdate.enter().append('circle');
		const ringsToExit: D3Selection = ringsToUpdate.exit();

		this.update(ringsToUpdate, range);
		this.enter(ringsToEnter, range);
		this.exit(ringsToExit);
	}

	private enter(container: D3Selection, range: number): void {
		this.renderRings(container, range);
	}

	private update(container: D3Selection, range: number): void {
		this.renderRings(container, range);
	}

	private exit(container: D3Selection): void {
		container.remove();
	}

	private renderRings(container: D3Selection, range: number): void {
		container
			.attr('class', 'ring')
			.attr('fill', 'transparent')
			.attr('transform', `translate(${range}, ${range})`)
			.attr('r', (ringRadius: number) => ringRadius)
			.attr('stroke', this.config$.getValue().ringsConfig.ringsColor)
			.attr('stroke-width', this.config$.getValue().ringsConfig.strokeWidth);
	}
}
