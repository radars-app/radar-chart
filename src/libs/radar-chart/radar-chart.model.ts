import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DotAction } from '../../models/dot-action';
import { RadarDot } from '../../models/radar-dot';
import { Sector } from '../../models/sector';

export class RadarChartModel {
	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectors$: BehaviorSubject<Sector[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;
	public readonly dots$: BehaviorSubject<RadarDot[]>;

	public readonly dotHovered$: Subject<DotAction>;
	public readonly dotHoveredOut$: Subject<DotAction>;
	public readonly dotClicked$: Subject<DotAction>;

	public readonly zoomEmitted$: Subject<true>;
	public readonly zoomIn$: Subject<void>;
	public readonly zoomOut$: Subject<void>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectors$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
		this.dotHovered$ = new Subject();
		this.dotHoveredOut$ = new Subject();
		this.dotClicked$ = new Subject();
		this.zoomEmitted$ = new Subject();
		this.zoomIn$ = new Subject();
		this.zoomOut$ = new Subject();
	}

	public zoomIn(): void {
		this.zoomIn$.next();
	}

	public zoomOut(): void {
		this.zoomOut$.next();
	}
}
