import { D3Selection } from '../../../models/types/d3-selection';
import { DotsConfig } from '../dots.config';
import { Cluster } from '../../../models/cluster';

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
		clusters.selectAll('circle').attr('r', dotsConfig.clusterRadius);
		singleDots.selectAll('circle').attr('r', dotsConfig.dotRadius);
	}
}
