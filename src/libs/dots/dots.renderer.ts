import { BehaviorSubject, combineLatest } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { calculateRingsRadiuses } from '../helpers/calculate-rings-radiuses';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import './dots.scss';

export class DotsRenderer {
	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.initBehavior();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get dotSpace(): number {
		return 2 * this.config.dotsConfig.dotOffset + this.config.dotsConfig.dotRadius;
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectorNames$, this.model.ringNames$]).subscribe(
			([rangeX, rangeY, config, sectorNames, ringNames]: [number, number, RadarChartConfig, string[], string[]]) => {
				const outerRingRadius: number = calculateOuterRingRadius(rangeX, rangeY, config);
				const ringRadiuses: number[] = calculateRingsRadiuses(outerRingRadius, ringNames);
				const trackRadiuses: number[] = this.calculateTrackRadiuses(ringRadiuses, outerRingRadius);
				console.log(trackRadiuses);
				trackRadiuses.forEach((radius: number) => {
					this.renderTracks(this.container, outerRingRadius, radius);
				});
			}
		);
	}

	private calculateTrackRadiuses(ringRadiuses: number[], outerRingRadius: number): number[] {
		const trackRadiuses: number[] = [];

		const radiusDelta: number = ringRadiuses[0];
		ringRadiuses.forEach((ringRadius: number, index: number) => {
			trackRadiuses.push(...this.getRingsTracksRadiuses(ringRadius, radiusDelta));
		});
		return trackRadiuses;
	}

	private getRingsTracksRadiuses(ringRadius: number, ringRadiusDelta: number): number[] {
		const tracksQuantity: number = Math.floor(ringRadiusDelta / this.dotSpace);
		const trackOffset: number = (this.dotSpace + (ringRadiusDelta % this.dotSpace)) / 2;
		const startRadius: number = ringRadius - ringRadiusDelta + trackOffset;

		return [...new Array(tracksQuantity)].map((_: undefined, trackIndex: number) => {
			return startRadius + this.dotSpace * trackIndex;
		});
	}

	private renderTracks(container: D3Selection, outerRingRadius: number, radius: number): D3Selection {
		return container
			.append('path')
			.attr(
				'd',
				`M ${outerRingRadius - radius}, ${outerRingRadius}
      	a ${radius},${radius} 0 1,0 ${radius * 2},0
				a ${radius},${radius} 0 1,0 -${radius * 2},0`
			)
			.classed('dots__track', true);
	}
}
