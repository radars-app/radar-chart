import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DotActionEvent } from '../../models/dot-action-event';
import { RadarDot } from '../../models/radar-dot';
import { Sector } from '../../models/sector';

export class RadarChartModel {
	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectors$: BehaviorSubject<Sector[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;
	public readonly dots$: BehaviorSubject<RadarDot[]>;

	public readonly _initialDotActionEvent: DotActionEvent = { dotId: undefined, element: null };
	public readonly dotMouseOver$: BehaviorSubject<DotActionEvent>;
	public readonly dotMouseOut$: BehaviorSubject<DotActionEvent>;
	public readonly dotClick$: Subject<DotActionEvent>;

	public readonly zoomEmitted$: Subject<true>;
	public readonly zoomIn$: Subject<true>;
	public readonly zoomOut$: Subject<false>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectors$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
		this.dotMouseOver$ = new BehaviorSubject(this._initialDotActionEvent);
		this.dotMouseOut$ = new BehaviorSubject(this._initialDotActionEvent);
		this.dotClick$ = new Subject();
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
