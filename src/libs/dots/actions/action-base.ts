import { D3Selection } from '../../../models/types/d3-selection';
import { DotsConfig } from '../dots.config';
import { Cluster } from '../../../models/cluster';
import { DotStatus } from '../../../models/dot-status';

export class ActionBase {
	protected hoveredClassName: string = 'dot--hovered';
	protected blurredClassName: string = 'dot--blurred';

	protected resetDotHover(container: D3Selection, dotsConfig: DotsConfig): void {
		container.classed(this.hoveredClassName, false);
		container.classed(this.blurredClassName, false);

		const clusters: D3Selection = container.filter((cluster: Cluster) => {
			return cluster.items.length > 1;
		});
		const singleDots: D3Selection = container.filter((cluster: Cluster) => {
			return cluster.items.length === 1;
		});
		const updatedAndExpiredDots: D3Selection = singleDots.filter((cluster: Cluster) => {
			return cluster.items[0].status === DotStatus.Updated || cluster.items[0].status === DotStatus.Moved;
		});
		const noChangesAndExpiredDots: D3Selection = singleDots.filter((cluster: Cluster) => {
			return cluster.items[0].status === DotStatus.NoChanges || cluster.items[0].status === DotStatus.Expired;
		});
		clusters.selectAll('circle').attr('r', dotsConfig.clusterRadius);
		noChangesAndExpiredDots.selectAll('circle').attr('r', dotsConfig.dotRadius);
		updatedAndExpiredDots
			.selectAll('.dot__circle > g')
			.attr('transform', `translate(-${dotsConfig.dotRadius + 2}, -${dotsConfig.dotRadius + 2})`)
			.selectAll('svg')
			.attr('width', dotsConfig.dotDiameterForStatusIcon)
			.attr('height', dotsConfig.dotDiameterForStatusIcon);
	}
}
