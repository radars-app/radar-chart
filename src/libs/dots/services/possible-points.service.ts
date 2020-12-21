import { BehaviorSubject } from 'rxjs';
import { Sector } from '../../../models/sector';
import { D3Selection } from '../../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../../helpers/calculate-outer-ring-radius';
import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { TracksService } from './tracks.service';

export class PossiblePointsService {
	private tracksService: TracksService;

	constructor(private config$: BehaviorSubject<RadarChartConfig>, private model: RadarChartModel) {
		this.tracksService = new TracksService(config$);
	}

	public calculatePossiblePoints(container: D3Selection): Map<string, PossiblePoint[]> {
		const trackElements: SVGPathElement[] = this.calculateTrackPaths(container);
		const possiblePoints: Map<string, PossiblePoint[]> = this.calculatePossiblePointsByTracks(trackElements);
		this.tracksService.clearTracks(container);
		return possiblePoints;
	}

	private calculateTrackPaths(container: D3Selection): SVGPathElement[] {
		const rangeX: number = this.model.rangeX$.getValue();
		const rangeY: number = this.model.rangeY$.getValue();
		const ringNames: string[] = this.model.ringNames$.getValue();
		const config: RadarChartConfig = this.config$.getValue();

		const outerRingRadius: number = calculateOuterRingRadius(rangeX, rangeY, config);
		this.tracksService.renderTracks(container, outerRingRadius, ringNames);
		const tracks: D3Selection = container.selectAll('path.track');
		return tracks.nodes();
	}

	private calculatePossiblePointsByTracks(trackElements: SVGPathElement[]): Map<string, PossiblePoint[]> {
		const possiblePoints: Map<string, PossiblePoint[]> = new Map();
		const ringNames: string[] = this.model.ringNames$.getValue();
		const sectors: Sector[] = this.model.sectors$.getValue();

		sectors.forEach((sector: Sector, sectorIndex: number) => {
			trackElements.forEach((track: SVGPathElement, trackIndex: number) => {
				const pointKey: string = `${this.getRingNameByTrackIndex(ringNames, trackElements.length, trackIndex)}-${sector.name}`;
				const isEdgeTrack: boolean = this.isSectorsEdgeTrack(ringNames.length, trackElements.length, trackIndex);
				const isCenterTrack: boolean = this.isSectorsCenterTrack(ringNames.length, trackElements.length, trackIndex);
				const sectorPoints: PossiblePoint[] = this.getPointsOnSectorsTrack(
					track,
					sectorIndex,
					sectors.length,
					isEdgeTrack,
					isCenterTrack
				);
				this.pushPossiblePoint(possiblePoints, pointKey, sectorPoints);
			});
		});

		return possiblePoints;
	}

	private pushPossiblePoint(possiblePoints: Map<string, PossiblePoint[]>, key: string, points: PossiblePoint[]): void {
		if (possiblePoints.has(key)) {
			possiblePoints.get(key).push(...points);
		} else {
			possiblePoints.set(key, points);
		}
	}

	private getRingNameByTrackIndex(ringNames: string[], tracksQuantity: number, trackIndex: number): string {
		const tracksPerRing: number = Math.floor(tracksQuantity / ringNames.length);
		const ringNameIndex: number = Math.floor(trackIndex / tracksPerRing);
		return ringNames[ringNameIndex];
	}

	private isSectorsEdgeTrack(ringsQuantity: number, tracksQuantity: number, trackIndex: number): boolean {
		const tracksPerRing: number = tracksQuantity / ringsQuantity;
		const isSectorsEdgeTrack: boolean = (trackIndex + 1) % tracksPerRing === 0 || (trackIndex + 1) % tracksPerRing === 1;
		return isSectorsEdgeTrack;
	}

	private isSectorsCenterTrack(ringsQuantity: number, tracksQuantity: number, trackIndex: number): boolean {
		const tracksPerRing: number = tracksQuantity / ringsQuantity;
		const trackInsideSector: number = (trackIndex + 1) % tracksPerRing;
		const centerTrack: number = Math.ceil(tracksPerRing / 2);
		let isSectorsCenterTrack: boolean;
		if (tracksPerRing % 2 === 0) {
			isSectorsCenterTrack = centerTrack === trackInsideSector || centerTrack - 1 === trackInsideSector;
		} else {
			isSectorsCenterTrack = centerTrack === trackInsideSector;
		}
		return isSectorsCenterTrack;
	}

	private getPointsOnSectorsTrack(
		track: SVGPathElement,
		sectorIndex: number,
		sectorsQuantity: number,
		isEdgeTrack: boolean,
		isCenterTrack: boolean
	): PossiblePoint[] {
		const dotDiameterWithOffsets: number = this.config$.getValue().dotsConfig.dotDiameterWithOffsets;

		const trackLength: number = track.getTotalLength() / sectorsQuantity;
		const pointsNormalize: number = (trackLength % dotDiameterWithOffsets) / 2;
		const startLength: number = pointsNormalize + dotDiameterWithOffsets / 2 + trackLength * sectorIndex;
		const pointsQuantity: number = Math.floor(trackLength / dotDiameterWithOffsets);

		const possiblePoints: PossiblePoint[] = [...new Array(pointsQuantity)].map((_: undefined, pointIndex: number) => {
			const pointLength: number = startLength + dotDiameterWithOffsets * pointIndex;

			const isFirstPoint: boolean = pointIndex === 0;
			const isLastPoint: boolean = pointIndex === pointsQuantity - 1;
			const isFirstSector: boolean = sectorIndex === 0;
			const isLastSector: boolean = sectorIndex === sectorsQuantity - 1;

			const isRightAreaForLabel: boolean = isCenterTrack && isFirstSector && isFirstPoint;
			const isLeftAreaForLabel: boolean = isCenterTrack && isLastSector && isLastPoint;

			if (isRightAreaForLabel || isLeftAreaForLabel) {
				return null;
			}

			const isCenterPont: boolean = Math.floor(pointsQuantity / 2) === pointIndex;
			const point: SVGPoint = track.getPointAtLength(pointLength);
			const possiblePoint: PossiblePoint = {
				x: point.x,
				y: point.y,
				isEdgePoint: isEdgeTrack && (isFirstPoint || isLastPoint),
			};
			return possiblePoint;
		});

		return possiblePoints.filter((possiblePoint: PossiblePoint) => possiblePoint);
	}
}
