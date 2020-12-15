import { easeLinear, select, selectAll } from 'd3';
import { Subject } from 'rxjs';
import { DotAction } from '../../..';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';

export class HoverAction {
	public static hoveredDotId: string = undefined;

	public static applyTo(container: D3Selection, hoveredEmitter: Subject<DotAction>): void {
		const hoveredClassName: string = 'dot--hovered';
		const blurredClassName: string = 'dot--blurred';
		const dot: RadarDot = container.datum();

		container
			.on('mouseenter', function (): void {
				HoverAction.hoveredDotId = dot.id;
				hoveredEmitter.next({
					dotId: dot.id,
					selector: `.${hoveredClassName}`,
				});
				container.classed(hoveredClassName, HoverAction.hoveredDotId === dot.id);
				selectAll('g.dot').classed(blurredClassName, true);
			})
			.on('mouseleave', function (): void {
				selectAll('g.dot').classed(hoveredClassName, false);
				selectAll('g.dot').classed(blurredClassName, false);
				this.classList.remove(hoveredClassName);
				HoverAction.hoveredDotId = undefined;
			});
	}
}
