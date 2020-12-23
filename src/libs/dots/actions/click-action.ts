import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class ClickAction {
	constructor(private model: RadarChartModel) {}

	public applyTo(container: D3Selection): void {
		const dot: RadarDot = container.datum();
		const self: ClickAction = this;
		container.on('click', function (): void {
			self.model.dotClicked$.next({
				dotId: dot.id,
				target: this,
			});
		});
	}
}
