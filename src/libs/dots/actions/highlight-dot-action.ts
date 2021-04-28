import { selectAll } from 'd3';
import { D3Selection } from '../../../models/types/d3-selection';
import { ActionBase } from './action-base';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class HighlightDotAction extends ActionBase {
	constructor(private model: RadarChartModel) {
		super();
		this.model.highlightedDot$.subscribe((itemId: string) => {
			this.highlightDot(itemId);
		});
	}

	private highlightDot(dotId: string): void {
		const self: HighlightDotAction = this;
		const allDots: D3Selection = selectAll('g.dot');
		let dotForHighlight: D3Selection;

		if (Boolean(dotId?.length)) {
			dotForHighlight = allDots.filter((dot: any) => {
				return dot?.items[0]?.id === dotId;
			});
			dotForHighlight.classed(self.hoveredClassName, true);
			allDots.classed(self.blurredClassName, true);
		} else {
			self.resetDotHover(allDots);
		}
	}
}
