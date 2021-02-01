import { selectAll } from 'd3';
import { D3Selection } from '../../../models/types/d3-selection';

export class DotAction {
	protected clickedClusterClassName: string = 'dot--clicked-cluster';
	protected hoveredClassName: string = 'dot--hovered';
	protected blurredClassName: string = 'dot--blurred';

	protected resetDotFocus(): D3Selection {
		const allDots: D3Selection = selectAll('g.dot');
		allDots.classed(this.hoveredClassName, false);
		allDots.classed(this.blurredClassName, false);
		return allDots;
	}
}
