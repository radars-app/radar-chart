import { BehaviorSubject } from 'rxjs';
import { DotActionEvent } from '../../../models/dot-action-event';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class HoverAction {
	public static applyTo(container: D3Selection, model: RadarChartModel): void {
		const dot: RadarDot = container.datum();

		container
			.on('mouseenter', function (): void {
				model.dotMouseOver$.next({
					dotId: dot.id,
					element: this,
				});
				model.dotMouseOut$.next(model._initialDotActionEvent);
			})
			.on('mouseleave', function (): void {
				model.dotMouseOut$.next({
					dotId: dot.id,
					element: this,
				});
				model.dotMouseOver$.next(model._initialDotActionEvent);
			});
	}
}
