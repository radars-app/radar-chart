import { D3Selection } from '../../../models/types/d3-selection';
import { ActionBase } from './action-base';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { Cluster } from '../../../models/cluster';
import { RadarDot } from '../../../models/radar-dot';
import { DotsConfig } from '../dots.config';
import { DotStatus } from '../../../models/dot-status';

export class HighlightDotAction extends ActionBase {
	constructor(private model: RadarChartModel, private container: D3Selection, private dotsConfig: DotsConfig) {
		super();
		this.model.highlightDot$.subscribe((itemId: string) => {
			this.highlightDot(itemId);
		});
	}

	private highlightDot(dotId: string): void {
		const self: HighlightDotAction = this;
		const allDots: D3Selection = this.container.selectAll('g.dot');
		let dotForHighlight: D3Selection;
		let clusterApplyTo: Cluster;

		if (Boolean(dotId)) {
			dotForHighlight = allDots.filter((cluster: Cluster) => {
				let isDotInCurrentCluster: boolean = false;
				cluster.items.forEach((item: RadarDot) => {
					if (item.id === dotId) {
						isDotInCurrentCluster = true;
					}
				});
				return isDotInCurrentCluster;
			});
			dotForHighlight.classed(self.hoveredClassName, true);
			clusterApplyTo = dotForHighlight.datum();

			const isCluster: boolean = clusterApplyTo.items.length > 1;
			const dotStatus: DotStatus = clusterApplyTo.items[0].status;

			if (isCluster) {
				dotForHighlight.select('circle').attr('r', self.dotsConfig.clusterRadius + 1);
			} else {
				if (dotStatus === DotStatus.Expired || dotStatus === DotStatus.NoChanges) {
					dotForHighlight.select('circle').attr('r', self.dotsConfig.dotRadius + 1);
				} else if (dotStatus === DotStatus.Updated || dotStatus === DotStatus.Moved) {
					dotForHighlight
						.select('.dot__circle > g')
						.attr('transform', `translate(-${self.dotsConfig.dotRadius + 3}, -${self.dotsConfig.dotRadius + 3})`)
						.select('svg')
						.attr('width', self.dotsConfig.dotDiameterForStatusIcon + 2)
						.attr('height', self.dotsConfig.dotDiameterForStatusIcon + 2);
				}
			}
		} else {
			self.resetDotHover(allDots, self.dotsConfig);
		}
	}
}
