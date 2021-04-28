import { D3Selection } from '../../../models/types/d3-selection';
import { ActionBase } from './action-base';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { Cluster } from '../../../models/cluster';

export class HighlightDotAction extends ActionBase {
	constructor(private model: RadarChartModel, private container: D3Selection) {
		super();
		this.model.highlightDot$.subscribe((itemId: string) => {
			this.highlightDot(itemId);
		});
	}

	private highlightDot(dotId: string): void {
		const self: HighlightDotAction = this;
		const allDots: D3Selection = this.container.selectAll('g.dot');
		let dotForHighlight: D3Selection;

		if (Boolean(dotId)) {
			dotForHighlight = allDots.filter((dot: Cluster) => {
				return dot?.items[0]?.id === dotId;
			});
			dotForHighlight.classed(self.hoveredClassName, true);
			allDots.classed(self.blurredClassName, true);
		} else {
			self.resetDotHover(allDots);
		}
	}
}
