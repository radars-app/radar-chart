import { BehaviorSubject } from 'rxjs';
import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { D3Selection } from '../../../models/types/d3-selection';
import { calculateRingsRadiuses } from '../../helpers/calculate-rings-radiuses';
import { ShadowPointsRenderer } from '../shadow-points/shadow-points.renderer';
import { selectAll } from 'd3';

export class TracksRenderer {
	private dotSpace: number;

	constructor(private config$: BehaviorSubject<RadarChartConfig>) {}

	public renderTracks(container: D3Selection, outerRingRadius: number, ringNames: string[], dotSpace: number): void {
		this.dotSpace = dotSpace;
		const ringRadiuses: number[] = calculateRingsRadiuses(outerRingRadius, ringNames);
		const trackRingsRadiuses: number[] = this.calculateTrackRadiuses(ringRadiuses);
		this.clearTracks(container);

		trackRingsRadiuses.forEach((radius: number) => {
			const track: D3Selection = this.renderSingleTrack(container, outerRingRadius, radius);
		});
	}

	private calculateTrackRadiuses(ringRadiuses: number[]): number[] {
		const trackRadiuses: number[] = [];

		const radiusDelta: number = ringRadiuses[0];
		ringRadiuses.forEach((ringRadius: number, index: number) => {
			trackRadiuses.push(...this.getSingleRingTracksRadiuses(ringRadius, radiusDelta));
		});
		return trackRadiuses;
	}

	private getSingleRingTracksRadiuses(ringRadius: number, ringRadiusDelta: number): number[] {
		const tracksQuantity: number = Math.floor(ringRadiusDelta / this.dotSpace);
		const trackOffset: number = (this.dotSpace + (ringRadiusDelta % this.dotSpace)) / 2;
		const startRadius: number = ringRadius - ringRadiusDelta + trackOffset;

		return [...new Array(tracksQuantity)].map((_: undefined, trackIndex: number) => {
			return startRadius + this.dotSpace * trackIndex;
		});
	}

	private clearTracks(container: D3Selection): void {
		container.selectAll('path.track').remove();
	}

	private renderSingleTrack(container: D3Selection, outerRingRadius: number, radius: number): D3Selection {
		return container
			.append('path')
			.attr(
				'd',
				`M ${outerRingRadius - radius}, ${outerRingRadius}
      	a ${radius},${radius} 0 1,0 ${radius * 2},0
				a ${radius},${radius} 0 1,0 -${radius * 2},0`
			)
			.classed('track', true);
	}
}
