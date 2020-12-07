import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DotHoveredEvent } from '../../models/dot-hovered-event';
import { RadarDot } from '../../models/radar-dot';
import { Sector } from '../../models/sector';

export class RadarChartModel {
	public readonly rangeX$: BehaviorSubject<number>;
	public readonly rangeY$: BehaviorSubject<number>;

	public readonly sectors$: BehaviorSubject<Sector[]>;
	public readonly ringNames$: BehaviorSubject<string[]>;
	public readonly dots$: BehaviorSubject<RadarDot[]>;

	public readonly hoveredDot$: BehaviorSubject<DotHoveredEvent>;

	constructor() {
		this.rangeX$ = new BehaviorSubject(1366);
		this.rangeY$ = new BehaviorSubject(662);
		this.sectors$ = new BehaviorSubject([]);
		this.ringNames$ = new BehaviorSubject([]);
		this.dots$ = new BehaviorSubject([]);
		this.hoveredDot$ = new BehaviorSubject(null);
	}
}
