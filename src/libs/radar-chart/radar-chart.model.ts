import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export class RadarChartModel {

	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectorNames$: BehaviorSubject<string[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(0);
		this.rangeY$ = new BehaviorSubject(0);
		this.sectorNames$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
	}
}
