import { Subject } from 'rxjs/internal/Subject';
import { DotAction } from '../../../models/dot-action';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';

export class ClickAction {
	public static applyTo(container: D3Selection, clickedEmitter: Subject<DotAction>): void {
		const dot: RadarDot = container.datum();
		container.on('click', function (): void {
			clickedEmitter.next({
				dotId: dot.id,
			});
		});
	}
}
