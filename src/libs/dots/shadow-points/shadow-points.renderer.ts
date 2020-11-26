import { selectAll, arc } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { D3Arc } from '../../../models/types/d3-arc';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartConfig } from '../../radar-chart/radar-chart.config';

export class ShadowPointsRenderer {
	private shadowPoints: Map<string, SVGPoint[]>;
	private dotSpace: number;

	constructor(private config$: BehaviorSubject<RadarChartConfig>) {}

	public renderShadowPoints(container: D3Selection, ringNames: string[], sectorNames: string[], dotSpace: number): void {
		this.dotSpace = dotSpace;
		const trackRing: D3Selection = selectAll('path.track');
		const trackRingElements: SVGPathElement[] = trackRing.nodes();
		this.shadowPoints = this.calculateShadowPoints(trackRingElements, ringNames, sectorNames);
		console.log(this.shadowPoints);
		this.shadowPoints.forEach((tracksDots: SVGPoint[]) => {
			this.renderTrackPoints(container, tracksDots);
		});
	}

	private calculateShadowPoints(trackElements: SVGPathElement[], ringNames: string[], sectorNames: string[]): Map<string, SVGPoint[]> {
		const shadowPoints: Map<string, SVGPoint[]> = new Map();
		trackElements.forEach((track: SVGPathElement, trackIndex: number) => {
			sectorNames.forEach((sectorName: string, sectorIndex: number) => {
				const pointKey: string = `${this.getRingNameByTrackIndex(trackIndex, ringNames)}-${sectorName}-${trackIndex}`;
				const sectorPoints: SVGPoint[] = this.getPointsOnSectorsTrack(track, sectorIndex, sectorNames.length);
				shadowPoints.set(pointKey, sectorPoints);
			});
		});

		return shadowPoints;
	}

	private getRingNameByTrackIndex(trackIndex: number, ringNames: string[]): string {
		const ringNameIndex: number = Math.floor(trackIndex / ringNames.length);
		return ringNames[ringNameIndex];
	}

	private getPointsOnSectorsTrack(track: SVGPathElement, sectorIndex: number, sectorsQuantity: number): SVGPoint[] {
		const trackLength: number = track.getTotalLength() / sectorsQuantity;
		const pointsNormalize: number = (trackLength % this.dotSpace) / 2;
		const startLength: number = pointsNormalize + this.dotSpace / 2 + trackLength * sectorIndex;
		const pointsQuantity: number = Math.floor(trackLength / this.dotSpace);

		return [...new Array(pointsQuantity)].map((_: undefined, pointIndex: number) => {
			const pointLength: number = startLength + this.dotSpace * pointIndex;
			return track.getPointAtLength(pointLength);
		});
	}

	private renderTrackPoints(container: D3Selection, tracksPoints: SVGPoint[]): void {
		const dot: D3Arc = arc()
			.innerRadius(0)
			.outerRadius(this.config$.getValue().dotsConfig.dotRadius)
			.startAngle(0)
			.endAngle(2 * Math.PI);

		tracksPoints.forEach((point: SVGPoint) => {
			container
				.append('path')
				.attr('d', dot)
				.classed('point', true)
				.classed('point--shadow', true)
				.attr('transform', `translate(${point.x}, ${point.y})`);
		});
	}
}
