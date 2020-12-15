import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class ClickAction {
	public static applyTo(container: D3Selection, model: RadarChartModel): void {
		const dot: RadarDot = container.datum();
		container.on('click', function (): void {
			model.dotClicked$.next({
				dotId: dot.id,
				target: this,
			});
		});
	}
}
