import { selectAll, arc } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { D3Arc } from '../../../models/types/d3-arc';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartConfig } from '../../radar-chart/radar-chart.config';

export class ShadowPointsRenderer {
	private shadowPoints: Map<string, ShadowPoint[]>;
	private dotSpace: number;

	constructor(private config$: BehaviorSubject<RadarChartConfig>) {}

	public renderShadowPoints(container: D3Selection, ringNames: string[], sectorNames: string[], dotSpace: number): void {
		this.clearPoints(container);
		this.dotSpace = dotSpace;
		const trackRing: D3Selection = selectAll('path.track');
		const trackRingElements: SVGPathElement[] = trackRing.nodes();
		this.shadowPoints = this.calculateShadowPoints(trackRingElements, ringNames, sectorNames);
		console.log(this.shadowPoints);

		this.shadowPoints.forEach((tracksPoints: ShadowPoint[]) => {
			this.renderTrackPoints(container, tracksPoints);
		});
	}

	private calculateShadowPoints(trackElements: SVGPathElement[], ringNames: string[], sectorNames: string[]): Map<string, ShadowPoint[]> {
		const shadowPoints: Map<string, ShadowPoint[]> = new Map();

		sectorNames.forEach((sectorName: string, sectorIndex: number) => {
			trackElements.forEach((track: SVGPathElement, trackIndex: number) => {
				const pointKey: string = `${this.getRingNameByTrackIndex(ringNames, trackElements.length, trackIndex)}-${sectorName}`;
				const sectorPoints: ShadowPoint[] = this.getPointsOnSectorsTrack(track, sectorIndex, sectorNames.length);
				this.addShadowPoints(shadowPoints, pointKey, sectorPoints);
			});
		});

		return shadowPoints;
	}

	private addShadowPoints(shadowPoints: Map<string, ShadowPoint[]>, key: string, points: ShadowPoint[]): void {
		if (shadowPoints.has(key)) {
			shadowPoints.get(key).push(...points);
		} else {
			shadowPoints.set(key, points);
		}
	}

	private getRingNameByTrackIndex(ringNames: string[], tracksQuantity: number, trackIndex: number): string {
		const tracksPerRing: number = Math.floor(tracksQuantity / ringNames.length);
		const ringNameIndex: number = Math.floor(trackIndex / tracksPerRing);
		return ringNames[ringNameIndex];
	}

	private getPointsOnSectorsTrack(track: SVGPathElement, sectorIndex: number, sectorsQuantity: number): ShadowPoint[] {
		const trackLength: number = track.getTotalLength() / sectorsQuantity;
		const pointsNormalize: number = (trackLength % this.dotSpace) / 2;
		const startLength: number = pointsNormalize + this.dotSpace / 2 + trackLength * sectorIndex;
		const pointsQuantity: number = Math.floor(trackLength / this.dotSpace);

		return [...new Array(pointsQuantity)].map((_: undefined, pointIndex: number) => {
			const pointLength: number = startLength + this.dotSpace * pointIndex;
			const shadowPoint: ShadowPoint = {
				point: track.getPointAtLength(pointLength),
				isEdgePoint: pointIndex === 0 || pointIndex === pointsQuantity - 1,
			};
			return shadowPoint;
		});
	}

	private clearPoints(container: D3Selection): void {
		container.selectAll('path.point.point--shadow').remove();
	}

	private renderTrackPoints(container: D3Selection, tracksPoints: ShadowPoint[]): void {
		const dot: D3Arc = arc()
			.innerRadius(0)
			.outerRadius(this.config$.getValue().dotsConfig.dotRadius)
			.startAngle(0)
			.endAngle(2 * Math.PI);

		tracksPoints.forEach((shadowPoint: ShadowPoint) => {
			container
				.append('path')
				.attr('d', dot)
				.classed('point', true)
				.classed('point--shadow', true)
				.classed('point--edge', shadowPoint.isEdgePoint)
				.attr('transform', `translate(${shadowPoint.point.x}, ${shadowPoint.point.y})`);
		});
	}
}
