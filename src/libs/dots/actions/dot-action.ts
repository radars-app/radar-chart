import { selectAll } from 'd3';
import { D3Selection } from '../../../models/types/d3-selection';

export class DotAction {
	protected hoveredClassName: string = 'dot--hovered';
	protected blurredClassName: string = 'dot--blurred';
	protected focusedClusterClassName: string = 'dot--focused-cluster';
	protected blurredClusterClassName: string = 'dot--blurred-cluster';

	protected resetDotFocus(): D3Selection {
		const allDots: D3Selection = selectAll('g.dot');
		allDots.classed(this.hoveredClassName, false);
		allDots.classed(this.blurredClassName, false);
		allDots.classed(this.focusedClusterClassName, false);
		allDots.classed(this.blurredClusterClassName, false);
		return allDots;
	}
}
