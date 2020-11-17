import { D3Selection } from '../../models/types/d3-selection';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { combineLatest } from 'rxjs';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { SubscriptionPool } from '../helpers/subscription-pool';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { calculateRingsRadiuses } from '../helpers/calculate-rings-radiuses';

export class RingsRenderer {
	private subscriptions: SubscriptionPool;

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.initBehavior();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.ringNames$]).subscribe(
			([rangeX, rangeY, config, ringNames]: [number, number, RadarChartConfig, string[]]) => {
				const outerRingRadius: number = calculateOuterRingRadius(rangeX, rangeY, config);
				const ringRadiuses: number[] = calculateRingsRadiuses(outerRingRadius, ringNames);
				this.render(outerRingRadius, ringRadiuses);
			}
		);
	}

	private render(range: number, ringsRadiuses: number[]): void {
		const ringsToUpdate: D3Selection = this.container.selectAll('circle.ring').data(ringsRadiuses);
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
