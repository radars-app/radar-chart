import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DotHoverEvent } from '../../models/dot-hover-event';
import { RadarDot } from '../../models/radar-dot';
import { Sector } from '../../models/sector';

export class RadarChartModel {
	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectors$: BehaviorSubject<Sector[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;
	public readonly dots$: BehaviorSubject<RadarDot[]>;

	public readonly dotHoverEvent$: BehaviorSubject<DotHoverEvent>;

	public readonly zoomIn$: Subject<true>;
	public readonly zoomOut$: Subject<false>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectors$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
		this.dotHoverEvent$ = new BehaviorSubject(null);
		this.zoomIn$ = new Subject();
		this.zoomOut$ = new Subject();
	}

	public zoomIn(): void {
		this.zoomIn$.next(true);
	}

	public zoomOut(): void {
		this.zoomOut$.next(false);
	}
}
