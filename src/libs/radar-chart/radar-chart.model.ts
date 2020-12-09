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

	public readonly _initialDotHoverEvent: DotHoverEvent = { dotId: undefined, element: null };
	public readonly dotMouseOver$: BehaviorSubject<DotHoverEvent>;
	public readonly dotMouseOut$: BehaviorSubject<DotHoverEvent>;

	public readonly zoomEmitted$: Subject<true>;
	public readonly zoomIn$: Subject<true>;
	public readonly zoomOut$: Subject<false>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectors$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
		this.dotMouseOver$ = new BehaviorSubject(this._initialDotHoverEvent);
		this.dotMouseOut$ = new BehaviorSubject(this._initialDotHoverEvent);
		this.zoomEmitted$ = new Subject();
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
