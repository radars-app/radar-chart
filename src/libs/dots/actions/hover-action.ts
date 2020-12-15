import { easeLinear } from 'd3';
import { Subject } from 'rxjs';
import { DotAction } from '../../..';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';

export class HoverAction {
	public static hoveredDotId: string = undefined;

	public static applyTo(container: D3Selection, hoveredEmitter: Subject<DotAction>, hoveredOutEmitter: Subject<DotAction>): void {
		const hoveredClassName: string = 'dot--hovered';
		const dot: RadarDot = container.datum();

		container
			.on('mouseenter', function (): void {
				this.classList.add('dot--hovered');
				HoverAction.hoveredDotId = dot.id;
				hoveredEmitter.next({
					dotId: dot.id,
					selector: `.${hoveredClassName}`,
				});
			})
			.on('mouseleave', function (): void {
				this.classList.remove(hoveredClassName);
				HoverAction.hoveredDotId = undefined;
				hoveredOutEmitter.next({
					dotId: dot.id,
				});
			})
			.transition()
			.duration(200)
			.ease(easeLinear)
			.attr('fill-opacity', function (): number {
				let opacity: number;
				if (Boolean(HoverAction.hoveredDotId)) {
					opacity = HoverAction.hoveredDotId === dot.id ? 1 : 0.6;
				} else {
					opacity = 0.8;
				}
				return opacity;
			});
	}
}
