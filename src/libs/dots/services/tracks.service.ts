import { BehaviorSubject } from 'rxjs';
import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { D3Selection } from '../../../models/types/d3-selection';
import { calculateRingsRadiuses } from '../../helpers/calculate-rings-radiuses';

export class TracksService {
	constructor(private config$: BehaviorSubject<RadarChartConfig>) {}

	public renderTracks(container: D3Selection, outerRingRadius: number, ringNames: string[]): void {
		const ringRadiuses: number[] = calculateRingsRadiuses(outerRingRadius, ringNames);
		const trackRingsRadiuses: number[] = this.calculateTrackRadiuses(ringRadiuses);

		trackRingsRadiuses.forEach((radius: number) => {
			this.renderTrack(container, outerRingRadius, radius);
		});
	}

	public clearTracks(container: D3Selection): void {
		container.selectAll('path.track').remove();
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
		const dotDiameterWithOffsets: number = this.config$.getValue().dotsConfig.dotDiameterWithOffsets;

		const tracksQuantity: number = Math.floor(ringRadiusDelta / dotDiameterWithOffsets);
		const trackOffset: number = (dotDiameterWithOffsets + (ringRadiusDelta % dotDiameterWithOffsets)) / 2;
		const startRadius: number = ringRadius - ringRadiusDelta + trackOffset;

		return [...new Array(tracksQuantity)].map((_: undefined, trackIndex: number) => {
			return startRadius + dotDiameterWithOffsets * trackIndex;
		});
	}

	private renderTrack(container: D3Selection, outerRingRadius: number, radius: number): D3Selection {
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
