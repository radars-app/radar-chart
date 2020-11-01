import { scaleLinear, ScaleLinear } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';

export class Scaler {
	public containerX: ScaleLinear<number, number>;
	public containerUpdaters: Function[] = [];

	public domainX: BehaviorSubject<number> = new BehaviorSubject(1366);
	public domainY: BehaviorSubject<number> = new BehaviorSubject(658);

	constructor(
		private size$: BehaviorSubject<Dimension>
	) {}

	public startContainerResizer(): void {
		this.size$.subscribe((size: Dimension) => {
			this.containerX = scaleLinear()
				.domain([0, this.domainX.getValue()])
				.range([0, size.width]);
			this.updateContainers();
		});

		this.domainX.subscribe(() => {
			this.updateContainers();
		});
	}

	private updateContainers(): void {
		this.containerUpdaters.forEach((update: Function) => {
			update();
		});
	}
}
