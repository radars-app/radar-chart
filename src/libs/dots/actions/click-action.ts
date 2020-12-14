import { Subject } from 'rxjs/internal/Subject';
import { DotActionEvent } from '../../../models/dot-action-event';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';

export class ClickAction {
	public static applyTo(container: D3Selection, clickEmitter: Subject<DotActionEvent>): void {
		const dot: RadarDot = container.datum();
		container.on('click', function (): void {
			clickEmitter.next({
				dotId: dot.id,
				element: this,
			});
		});
	}
}
