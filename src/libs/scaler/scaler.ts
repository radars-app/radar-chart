import { scaleLinear, ScaleLinear } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';

export class Scaler {
	public containerX: ScaleLinear<number, number>;

	public domainX: BehaviorSubject<number> = new BehaviorSubject(1366);
	public domainY: BehaviorSubject<number>;

	constructor() {}

	public startContainerResizer(size$: BehaviorSubject<Dimension>, callback: Function): void {
		size$.subscribe((size: Dimension) => {
			this.containerX = scaleLinear()
				.domain([0, this.domainX.getValue()])
				.range([0, size.width]);

			callback();
		});

		this.domainX.subscribe(() => {
			callback();
		});
	}
}
