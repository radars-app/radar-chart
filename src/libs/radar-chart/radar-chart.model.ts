import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ThemeModel } from '../theme/theme.model';
import { RootCircleModel } from '../root-circle/root-circle.model';

export class RadarChartModel {
	public readonly theming: ThemeModel;
	public readonly rootCircle: BehaviorSubject<RootCircleModel>;

	constructor() {
		this.theming = new ThemeModel();
	}
}
