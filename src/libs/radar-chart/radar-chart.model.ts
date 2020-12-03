import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarDot } from '../../models/radar-dot';

export class RadarChartModel {
	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectorNames$: BehaviorSubject<string[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;
	public readonly dots$: BehaviorSubject<RadarDot[]>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectorNames$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
	}
}
