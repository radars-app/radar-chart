import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ThemeConfig } from './theme.config';

export class ThemeModel {
	public readonly themeConfig: BehaviorSubject<ThemeConfig>;

	constructor() {
		this.themeConfig = new BehaviorSubject(new ThemeConfig());
	}

	public applyTheme(themeConfig: ThemeConfig): void {
		this.themeConfig.next(themeConfig);
	}
}
