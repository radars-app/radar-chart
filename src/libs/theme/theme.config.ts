import { RadarColorConfig } from '../../models/radar-color-config';
import { LightTheme } from './default-themes/light-theme';

export class ThemeConfig {
	public readonly radarColorConfig: RadarColorConfig;
	public readonly radarLineStroke: number;

	constructor() {
		this.radarColorConfig = LightTheme.radarColorConfig;
		this.radarLineStroke = LightTheme.radarLineStroke;
	}
}
