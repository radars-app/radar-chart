import { D3Selection } from '../../../models/types/d3-selection';

export class ActionBase {
	protected hoveredClassName: string = 'dot--hovered';
	protected blurredClassName: string = 'dot--blurred';
	protected focusedClusterClassName: string = 'dot--focused-cluster';
	protected blurredClusterClassName: string = 'dot--blurred-cluster';

	protected resetDotHover(container: D3Selection): void {
		container.classed(this.hoveredClassName, false);
		container.classed(this.blurredClassName, false);
	}

	protected resetDotFocus(container: D3Selection): void {
		container.classed(this.focusedClusterClassName, false);
		container.classed(this.blurredClusterClassName, false);
	}
}
