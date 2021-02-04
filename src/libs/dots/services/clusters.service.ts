import { Cluster } from '../../../models/cluster';
import { PossiblePoint } from '../../../models/possible-point';
import { RadarDot } from '../../../models/radar-dot';

export class ClustersService {
	private clusters: Cluster[];

	constructor() {}

	public calculateClusters(dots: RadarDot[], possiblePoints: Map<string, PossiblePoint[]>): Cluster[] {
		this.clusters = [];
		dots.forEach((dot: RadarDot) => {
			const possiblePoint: PossiblePoint = this.choosePoint(dot, possiblePoints, 0);
			const cluster: Cluster = this.createClusterIfNotExists(possiblePoint.x, possiblePoint.y);
			cluster.items.push(dot);
		});

		return this.clusters;
	}

	private createClusterIfNotExists(x: number, y: number): Cluster {
		const existingCluster: Cluster = this.getClusterByPoint(x, y);

		if (Boolean(existingCluster)) {
			return existingCluster;
		} else {
			const newCluster: Cluster = {
				x,
				y,
				items: [],
			};
			this.clusters.push(newCluster);
			return newCluster;
		}
	}

	private getClusterByPoint(x: number, y: number): Cluster {
		const existingCluster: Cluster = this.clusters.find((cluster: Cluster) => {
			return cluster.x === x && cluster.y === y;
		});

		return existingCluster;
	}

	private choosePoint(dot: RadarDot, possiblePoints: Map<string, PossiblePoint[]>, clusterIteration: number): PossiblePoint {
		const sectorsPoints: PossiblePoint[] = possiblePoints.get(`${dot.ring}-${dot.sector}`);
		const possiblePointsForDot: PossiblePoint[] = sectorsPoints.filter((point: PossiblePoint) => {
			const isOccupied: boolean = point.itemsQuantity >= clusterIteration;
			return !isOccupied;
		});
		const pointsToAvoid: PossiblePoint[] = sectorsPoints.filter((point: PossiblePoint) => {
			const isOccupied: boolean = point.itemsQuantity >= clusterIteration;
			return point.isEdgePoint || isOccupied;
		});

		let candidatePoint: PossiblePoint = null;
		let candidateDistance: number = 0;
		possiblePointsForDot.forEach((possiblePoint: PossiblePoint, index: number) => {
			let currentDistance: number = 300;
			pointsToAvoid.forEach((pointToAvoid: PossiblePoint) => {
				const diffX: number = pointToAvoid.x - possiblePoint.x;
				const diffY: number = pointToAvoid.y - possiblePoint.y;
				const lengthBetween: number = Math.sqrt(diffX ** 2 + diffY ** 2);
				if (lengthBetween < currentDistance) {
					currentDistance = lengthBetween;
				}
			});

			if (currentDistance > candidateDistance) {
				candidatePoint = possiblePointsForDot[index];
				candidateDistance = currentDistance;
			}
		});

		if (candidatePoint === null) {
			candidatePoint = possiblePointsForDot[0];
		}

		if (candidatePoint === undefined) {
			candidatePoint = this.choosePoint(dot, possiblePoints, ++clusterIteration);
		} else {
			candidatePoint.itemsQuantity++;
		}

		return candidatePoint;
	}
}
